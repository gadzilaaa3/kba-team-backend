import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/roles/enums/role.enum';
import { Projection } from 'src/common/types/projectionType.type';
import { FilterType } from 'src/common/types/filterType.type';
import { ActivitiesService } from 'src/activities/activities.service';
import { ContactsService } from 'src/contacts/contacts.service';
import { PaginateResponse } from 'src/common/pagination/types/pagination-response.type';
import { WithPaginate } from 'src/common/pagination/with-paginate';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private contactsModel: ContactsService,
    private activitiesModel: ActivitiesService,
  ) {}
  async findById(
    id: string,
    projection?: Projection<User>,
    withPopulate = true,
  ) {
    if (withPopulate) {
      return this.userModel
        .findById(id, projection)
        .populate(['contacts', 'activities']);
    }
    return this.userModel.findById(id, projection);
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    createdUser.activities = await this.activitiesModel.create();
    createdUser.contacts = await this.contactsModel.create({
      contactMail: createdUser.email,
    });
    return createdUser.save();
  }

  async findMany(
    offset: number = 0,
    limit: number = 20,
    searchQuery?: string,
    sortField: string = 'username',
    fieldsQuery: string = '',
  ): Promise<PaginateResponse<User>> {
    // Filter || Search
    const regexp = new RegExp(searchQuery, 'i');
    const filter = { username: regexp };
    //

    // Sort
    const sortQuery = {};
    if (sortField !== '') sortQuery[sortField] = 'descending';
    //

    fieldsQuery += ' -password';

    const query = this.userModel.find(filter, fieldsQuery).sort(sortQuery);

    const total = await this.userModel.countDocuments(filter);

    return WithPaginate.paginate<User>(query, offset, limit, total);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<UserDocument> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async findOne(filter?: FilterType<User>, projection?: Projection<User>) {
    return this.userModel.findOne(filter, projection).exec();
  }

  async setRoles(userId: string, roles: Role[]) {
    const user = await this.findById(userId, { roles: 1 });

    const rolesSet = new Set(roles);
    const rolesArray = Array(...rolesSet);

    return await this.update(user.id, { roles: rolesArray });
  }
}
