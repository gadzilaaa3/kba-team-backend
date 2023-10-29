import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';
import { Auth } from 'src/common/decorators/auth.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { PaginatedDto } from 'src/common/interfaces/paginated.dto';
import { UserFromAuth } from 'src/common/interfaces/user-from-auth.interface';
import { PaginationParams } from 'src/common/pagination/paginationParams';
import { PaginatedResponse } from 'src/common/pagination/types/pagination-response.type';
import { ValidateMongoId } from 'src/common/pipes/mongoId.pipe';
import { Role } from 'src/roles/enums/role.enum';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateCollaboratorsDto } from './dto/update-collaborators.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectDto } from './project.interface';
import { ProjectsService } from './projects.service';
import { Project } from './schemas/project.schema';

@ApiTags('Projects')
@ApiExtraModels(PaginatedDto)
@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @ApiOperation({ description: 'Get all projects with paginate.' })
  @ApiTooManyRequestsResponse({ description: 'Too many requests' })
  @ApiBadRequestResponse({
    description: 'Bad Request: check the query parameters.',
  })
  @ApiPaginatedResponse(ProjectDto)
  @ApiQuery({
    name: 'search',
    type: String,
    required: false,
  })
  @Get()
  findMany(
    @Query() paginationParams: PaginationParams,
    @Query('search') search: string,
  ): Promise<PaginatedResponse<Project>> {
    const regex = new RegExp(search, 'i');
    const filter = { username: regex };
    return this.projectsService.findMany(paginationParams, filter);
  }

  @ApiOperation({ description: 'Get a list of projects created by the user.' })
  @ApiTooManyRequestsResponse({ description: 'Too many requests' })
  @ApiBadRequestResponse({
    description: 'Bad Request: check query parameters.',
  })
  @ApiNotFoundResponse({ description: 'Not Found: there is no such user.' })
  @ApiPaginatedResponse(ProjectDto)
  @Get('assigned/:username')
  async getUserAssignedProjects(
    @Param('username') username: string,
    @Query() paginationParams: PaginationParams,
  ) {
    return this.projectsService.getAssignedProjects(paginationParams, username);
  }

  @ApiOperation({ description: 'Get user projects as a collaborator.' })
  @ApiTooManyRequestsResponse({ description: 'Too many requests' })
  @ApiBadRequestResponse({
    description: 'Bad Request: check query parameters.',
  })
  @ApiNotFoundResponse({ description: 'Not Found: there is no such user.' })
  @ApiPaginatedResponse(ProjectDto)
  @Get(':username')
  async getUserProjectsAsCollaborator(
    @Param('username') username: string,
    @Query() paginationParams: PaginationParams,
  ) {
    return this.projectsService.getUserProjects(paginationParams, username);
  }

  @ApiOperation({ description: 'Get project by id' })
  @ApiOkResponse({
    type: ProjectDto,
    description: 'Ok',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request: check the id parameter.',
  })
  @ApiTooManyRequestsResponse({ description: 'Too many requests' })
  @Get(':id')
  findById(
    @Param('id', ValidateMongoId)
    id: string,
  ) {
    return this.projectsService.findById(id);
  }

  @ApiOperation({ description: 'Create project.' })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden: You must have the "admin" role',
  })
  @ApiCreatedResponse({
    description: 'Created',
    type: ProjectDto,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiTooManyRequestsResponse({ description: 'Too many requests' })
  @Auth(Role.Admin)
  @Post()
  create(
    @Body() createProjectDto: CreateProjectDto,
    @User() user: UserFromAuth,
  ) {
    return this.projectsService.create(createProjectDto, user.sub);
  }

  @ApiOperation({ description: 'Update project.' })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden: You must have the "admin" or "super-admin" role',
  })
  @ApiOkResponse({ description: 'Ok', type: ProjectDto })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiTooManyRequestsResponse({ description: 'Too many requests' })
  @HttpCode(200)
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

  @ApiOperation({ description: 'Delete project.' })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden: You must be the creator of the project or have "super-admin" role',
  })
  @ApiOkResponse({ description: 'Ok' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiTooManyRequestsResponse({ description: 'Too many requests' })
  @Auth(Role.Admin, Role.SuperAdmin)
  @Delete(':id')
  async delete(
    @Param('id', ValidateMongoId) id: string,
    @User() user: UserFromAuth,
  ) {
    await this.checkAvailability(id, user);
    await this.projectsService.delete(id);
  }

  @ApiOperation({ description: 'Add a collaborator from the project.' })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden: You must be the creator of the project or have "super-admin" role',
  })
  @ApiOkResponse({ description: 'Ok' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiTooManyRequestsResponse({ description: 'Too many requests' })
  @Auth(Role.Admin, Role.SuperAdmin)
  @Patch(':id/collaborators/add')
  async addCollaborator(
    @Param('id', ValidateMongoId) id: string,
    @User() user: UserFromAuth,
    @Body() updateCollaboratorsDto: UpdateCollaboratorsDto,
  ) {
    await this.checkAvailability(id, user);
    await this.projectsService.addCollaborator(id, updateCollaboratorsDto);
  }

  @ApiOperation({ description: 'Remove a collaborator from a project.' })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden: You must be the creator of the project or have "super-admin" role',
  })
  @ApiOkResponse({ description: 'Ok' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiTooManyRequestsResponse({ description: 'Too many requests' })
  @Auth(Role.Admin, Role.SuperAdmin)
  @Patch(':id/collaborators/remove')
  async removeCollaborator(
    @Param('id', ValidateMongoId) id: string,
    @User() user: UserFromAuth,
    @Body() updateCollaboratorsDto: UpdateCollaboratorsDto,
  ) {
    await this.checkAvailability(id, user);
    await this.projectsService.removeCollaborator(id, updateCollaboratorsDto);
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
