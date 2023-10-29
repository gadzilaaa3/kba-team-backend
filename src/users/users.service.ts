import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActivitiesService } from 'src/activities/activities.service';
import { PaginationParams } from 'src/common/pagination/paginationParams';
import { PaginatedResponse } from 'src/common/pagination/types/pagination-response.type';
import { WithPaginate } from 'src/common/pagination/with-paginate';
import { FilterType } from 'src/common/types/filterType.type';
import { Projection } from 'src/common/types/projectionType.type';
import { ContactsService } from 'src/contacts/contacts.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private contactsModel: ContactsService,
    private activitiesModel: ActivitiesService,
  ) {}

  async findById(id: string, projection?: Projection<User>) {
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
    paginationParams: PaginationParams,
    search?: string,
  ): Promise<PaginatedResponse<User>> {
    const regex = new RegExp(search, 'i');
    const filter = { username: regex };
    const query = this.userModel.find(filter, { roles: 0 });
    const total = await this.userModel.countDocuments(filter);
    return WithPaginate.paginate<User>(
      query,
      paginationParams.offset,
      paginationParams.limit,
      total,
    );
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, {
        new: true,
        projection: { roles: 0 },
      })
      .exec();
  }

  async remove(id: string): Promise<UserDocument> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async findOne(filter?: FilterType<User>, projection?: Projection<User>) {
    return this.userModel.findOne(filter, projection).exec();
  }
}
