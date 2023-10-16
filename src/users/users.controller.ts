import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/roles/enums/role.enum';
import { Auth } from 'src/common/decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';
import { UpdateRolesDto } from './dto/update-roles.dto';
import { PaginationParams } from 'src/common/pagination/paginationParams';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Auth(Role.SuperAdmin)
  @Get()
  async findMany(@Query() paginationParams: PaginationParams) {
    return this.usersService.findMany(paginationParams);
  }

  @Auth(Role.SuperAdmin)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.usersService.findById(id, { password: 0 });
  }

  @Auth(Role.SuperAdmin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Auth(Role.SuperAdmin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Auth(Role.SuperAdmin)
  @Patch(':id/roles')
  setRoles(@Param('id') id: string, @Body() { roles }: UpdateRolesDto) {
    return this.usersService.setRoles(id, roles);
  }
}
