import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HashService } from 'src/common/services/hash.service';
import { Role } from 'src/roles/enums/role.enum';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AdminService {
  constructor(private usersService: UsersService) {}

  async createUser(dto: CreateUserDto) {
    let userExists = await this.usersService.findOne(
      { username: dto.username },
      { _id: true },
    );
    if (userExists) {
      throw new ConflictException('User already exists');
    }
    userExists = await this.usersService.findOne(
      { email: dto.email },
      { _id: true },
    );
    if (userExists) {
      throw new ConflictException('User already exists');
    }

    // Hash password
    const hash = await HashService.hashData(dto.password);
    return this.usersService.create({
      ...dto,
      password: hash,
    });
  }

  async setUserRoles(userId: string, roles: Role[]) {
    const user = await this.usersService.findById(userId, { roles: 1 });

    if (!user) {
      throw new NotFoundException('There is no such user');
    }

    if (
      user.roles.includes(Role.SuperAdmin) &&
      !roles.includes(Role.SuperAdmin)
    ) {
      throw new ConflictException(
        'You cannot deprive a user of the super admin role',
      );
    }

    const rolesSet = new Set(roles);
    const rolesArray = Array(...rolesSet);

    return await this.usersService.update(user.id, { roles: rolesArray });
  }
}
