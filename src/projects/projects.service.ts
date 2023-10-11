import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { Document, Model, Types } from 'mongoose';
import { CreateProjectDto } from './dto/create-project.dto';
import { PaginateResponse } from 'src/common/pagination/types/pagination-response.type';
import { WithPaginate } from 'src/common/pagination/with-paginate';
import { Projection } from 'src/common/types/projectionType.type';
import { FilterType } from 'src/common/types/filterType.type';

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

  async findById(id: string, projection?: Projection<Project>) {
    return this.projectModel
      .findById(id, projection)
      .populate('assigned', {
        password: 0,
        roles: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      })
      .populate('collaborators', {
        password: 0,
        roles: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      });
  }

  async findMany(
    offset: number = 0,
    limit: number = 20,
    sortField: string = 'name',
    fieldsQuery: string = '',
    filter?: FilterType<Project>,
  ): Promise<PaginateResponse<Project>> {
    // Sort
    const sortQuery = {};
    if (sortField !== '') sortQuery[sortField] = 'descending';
    //

    // Fields
    const fields = fieldsQuery.split(' ');
    //

    const query = this.projectModel.find(filter, fieldsQuery).sort(sortQuery);

    // Fields
    if (
      fields.includes('assigned') ||
      (fieldsQuery === '' && !fields.includes('-assigned'))
    ) {
      query.populate('assigned', 'username');
    }
    if (
      fields.includes('collaborators') ||
      (fieldsQuery === '' && !fields.includes('-collaborators'))
    ) {
      query.populate('collaborators', 'username');
    }
    //

    const total = await this.projectModel.countDocuments(filter);

    return WithPaginate.paginate<Project>(query, offset, limit, total);
  }

  async update() {}

  async delete(projectId: string, userId: string) {
    const project = await this.projectModel.findOne({
      _id: projectId,
      assigned: userId,
    });

    if (project) {
      return this.projectModel.findByIdAndDelete(projectId);
    }
    throw new ForbiddenException();
  }
}
