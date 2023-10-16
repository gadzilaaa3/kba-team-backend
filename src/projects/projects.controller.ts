import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Role } from 'src/roles/enums/role.enum';
import { User } from 'src/common/decorators/user.decorator';
import { UserFromAuth } from 'src/common/interfaces/user-from-auth.interface';
import { ApiTags } from '@nestjs/swagger';
import { PaginationParams } from 'src/common/pagination/paginationParams';
import { Project } from './schemas/project.schema';
import { PaginateResponse } from 'src/common/pagination/types/pagination-response.type';
import { ValidateMongoId } from 'src/common/pipes/mongoId.pipe';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UpdateCollaboratorsDto } from './dto/update-collaborators.dto';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  findMany(
    @Query() { offset, limit }: PaginationParams,
    @Query('sort') sort: string,
    @Query('fields') fields: string,
    @Query('search') search: string = '',
  ): Promise<PaginateResponse<Project>> {
    return this.projectsService.findMany(offset, limit, sort, fields, {
      name: new RegExp(search, 'i'),
    });
  }

  @Get(':id')
  findById(
    @Param('id', ValidateMongoId)
    id: string,
  ) {
    return this.projectsService.findById(id);
  }

  @Auth(Role.Admin)
  @Post()
  create(
    @Body() createProjectDto: CreateProjectDto,
    @User() user: UserFromAuth,
  ) {
    return this.projectsService.create(createProjectDto, user.sub);
  }

  @Auth(Role.Admin, Role.SuperAdmin)
  @Patch(':id')
  async update(
    @Param('id', ValidateMongoId) id: string,
    @User() user: UserFromAuth,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    await this.checkAvailability(id, user);
    return this.projectsService.update(id, updateProjectDto);
  }

  @Auth(Role.Admin, Role.SuperAdmin)
  @Delete(':id')
  async delete(
    @Param('id', ValidateMongoId) id: string,
    @User() user: UserFromAuth,
  ) {
    await this.checkAvailability(id, user);
    return this.projectsService.delete(id);
  }

  @Auth(Role.Admin, Role.SuperAdmin)
  @Patch(':id/collaborators/add')
  async addCollaborator(
    @Param('id', ValidateMongoId) id: string,
    @User() user: UserFromAuth,
    @Body() updateCollaboratorsDto: UpdateCollaboratorsDto,
  ) {
    await this.checkAvailability(id, user);
    return this.projectsService.addCollaborator(id, updateCollaboratorsDto);
  }

  @Auth(Role.Admin, Role.SuperAdmin)
  @Patch(':id/collaborators/remove')
  async removeCollaborator(
    @Param('id', ValidateMongoId) id: string,
    @User() user: UserFromAuth,
    @Body() updateCollaboratorsDto: UpdateCollaboratorsDto,
  ) {
    await this.checkAvailability(id, user);
    return this.projectsService.removeCollaborator(id, updateCollaboratorsDto);
  }

  private async checkAvailability(projectId: string, user: UserFromAuth) {
    if (user.roles.includes(Role.SuperAdmin)) {
      return true;
    }

    const project = await this.projectsService.findOne({
      _id: projectId,
      assigned: user.sub,
    });

    if (project) {
      return true;
    }
    throw new ForbiddenException();
  }
}
