import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationParams } from 'src/common/pagination/paginationParams';
import { PaginatedResponse } from 'src/common/pagination/types/pagination-response.type';
import { WithPaginate } from 'src/common/pagination/with-paginate';
import { FilterType } from 'src/common/types/filterType.type';
import { Projection } from 'src/common/types/projectionType.type';
import { UsersService } from 'src/users/users.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateCollaboratorsDto } from './dto/update-collaborators.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project, ProjectDocument } from './schemas/project.schema';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name)
    private projectModel: Model<ProjectDocument>,
    private usersService: UsersService,
  ) {}

  async create(createProjectDto: CreateProjectDto, assigned: string) {
    return this.projectModel.create({
      ...createProjectDto,
      assigned,
      collaborators: [assigned],
    });
  }

  async findById(
    id: string,
    projection?: Projection<Project>,
    withPopulate = true,
  ) {
    if (withPopulate) {
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
    return this.projectModel.findById(id, projection);
  }

  async findOne(
    filter?: FilterType<Project>,
    projection?: Projection<Project>,
  ) {
    return this.projectModel.findOne(filter, projection).exec();
  }

  async findMany(
    paginationParams: PaginationParams,
    filter?: FilterType<Project>,
  ): Promise<PaginatedResponse<Project>> {
    const query = this.projectModel.find(filter);

    query.populate('assigned', 'username');
    query.populate('collaborators', 'username');

    const total = await this.projectModel.countDocuments(filter);

    return WithPaginate.paginate<Project>(
      query,
      paginationParams.offset,
      paginationParams.limit,
      total,
    );
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const project = await this.findById(id, { id: true });
    if (!project) {
      throw new BadRequestException('There is no such project');
    }

    return this.projectModel.findByIdAndUpdate(id, updateProjectDto, {
      new: true,
    });
  }

  async delete(projectId: string) {
    return this.projectModel.findByIdAndDelete(projectId);
  }

  async addCollaborator(id: string, dto: UpdateCollaboratorsDto) {
    const user = await this.usersService.findOne(
      { username: dto.username },
      { username: true, email: true },
    );
    if (!user) {
      throw new NotFoundException('There is no such user');
    }

    const project = await this.findById(id);
    if (!project) {
      throw new NotFoundException('There is no such project');
    }

    const collaboratorInProject = project.collaborators.some((collaborator) => {
      return collaborator.username === user.username;
    });
    if (!collaboratorInProject) {
      project.collaborators.push(user);
    } else {
      throw new ConflictException(
        'This user is already a collaborator of the project',
      );
    }
    return project.save();
  }

  async removeCollaborator(id: string, dto: UpdateCollaboratorsDto) {
    const user = await this.usersService.findOne(
      { username: dto.username },
      { username: true, email: true },
    );
    if (!user) {
      throw new NotFoundException('There is no such user');
    }

    const project = await this.findById(id);
    if (!project) {
      throw new NotFoundException('There is no such project');
    }

    if (project.assigned.username === user.username) {
      throw new ConflictException(
        'You cannot remove yourself from the project collaborators',
      );
    }

    const index = project.collaborators.findIndex((collaborator) => {
      return collaborator.username === user.username;
    });
    if (index !== -1) {
      project.collaborators.splice(index, 1);
    } else {
      throw new BadRequestException(
        'This user is not a collaborator of the project',
      );
    }

    return project.save();
  }

  async getAssignedProjects(
    paginationParams: PaginationParams,
    username: string,
  ) {
    const user = await this.usersService.findOne({ username }, { id: 1 });

    if (!user) {
      throw new NotFoundException('There is no user with such username.');
    }

    return this.findMany(paginationParams, {
      assigned: user.id,
    });
  }

  async getUserProjects(paginationParams: PaginationParams, username: string) {
    const user = await this.usersService.findOne({ username }, { id: 1 });

    if (!user) {
      throw new NotFoundException('There is no user with such username.');
    }

    return this.findMany(paginationParams, {
      collaborators: user.id,
    });
  }
}
