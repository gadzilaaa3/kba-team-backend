import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { Model } from 'mongoose';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name)
    private projectModel: Model<ProjectDocument>,
  ) {}

  async create(createProjectDto: CreateProjectDto, assigned: string) {
    return (await this.projectModel.create({ ...createProjectDto, assigned }))
      .id;
  }
  async findAll(): Promise<ProjectDocument[]> {
    return this.projectModel
      .find()
      .populate('assigned', 'username')
      .populate('collaborators', 'username')
      .exec();
  }

  // async findById(id: string): Promise<UserDocument> {
  //   return this.userModel.findById(id);
  // }

  // async findByUsername(username: string): Promise<UserDocument> {
  //   return this.userModel.findOne({ username });
  // }

  // async findByEmail(email: string): Promise<UserDocument> {
  //   return this.userModel.findOne({ email });
  // }

  // async update(
  //   id: string,
  //   updateUserDto: UpdateUserDto,
  // ): Promise<UserDocument> {
  //   return this.userModel
  //     .findByIdAndUpdate(id, updateUserDto, { new: true })
  //     .exec();
  // }

  // async remove(id: string): Promise<UserDocument> {
  //   return this.userModel.findByIdAndDelete(id).exec();
  // }
}
