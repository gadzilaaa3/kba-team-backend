import { Body, Controller, Get, Patch, Query } from '@nestjs/common';
import { Auth } from 'src/common/decorators/auth.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { UserFromAuth } from 'src/common/interfaces/user-from-auth.interface';
import { Role } from 'src/roles/enums/role.enum';
import { MeService } from './me.service';
import { UpdateActivitiesDto } from 'src/activities/dto/update-activities.dto';
import { UpdateContactsDto } from 'src/contacts/dto/update-contacts.dto';
import { PaginationParams } from 'src/common/pagination/paginationParams';
import { PaginatedResponse } from 'src/common/pagination/types/pagination-response.type';
import { Project } from 'src/projects/schemas/project.schema';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ProjectsService } from 'src/projects/projects.service';
import { UserDto } from 'src/users/user.interface';
import { ActivitiesDto } from 'src/activities/activities.interface';
import { ContactsDto } from 'src/contacts/contacts.interface';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';
import { ProjectDto } from 'src/projects/project.interface';

@ApiTags('Me')
@Controller('me')
export class MeController {
  constructor(
    private meService: MeService,
    private projectsService: ProjectsService,
  ) {}

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiOperation({ description: 'Get your personal data.' })
  @ApiOkResponse({ type: UserDto, description: 'Ok' })
  @ApiTooManyRequestsResponse({ description: 'Too many requests' })
  @Get()
  @Auth(Role.Admin)
  async getYourSelf(@User() user: UserFromAuth) {
    return this.meService.getYourSelf(user.sub);
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiOperation({ description: 'Get your activities.' })
  @ApiOkResponse({ type: ActivitiesDto, description: 'Ok' })
  @ApiTooManyRequestsResponse({ description: 'Too many requests' })
  @Get('activities')
  @Auth(Role.Admin)
  async getActivities(@User() user: UserFromAuth) {
    return this.meService.getActivities(user.sub);
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiOperation({ description: 'Update your activities.' })
  @ApiBadRequestResponse({ description: 'Bad Request: check your input data.' })
  @ApiOkResponse({ type: ActivitiesDto, description: 'Ok' })
  @ApiTooManyRequestsResponse({ description: 'Too many requests' })
  @Patch('activities')
  @Auth(Role.Admin)
  async updateActivities(
    @User() user: UserFromAuth,
    @Body() updateActivitiesDto: UpdateActivitiesDto,
  ) {
    return this.meService.updateActivities(user.sub, updateActivitiesDto);
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiOperation({ description: 'Get your contacts.' })
  @ApiOkResponse({ type: ContactsDto, description: 'Ok' })
  @ApiTooManyRequestsResponse({ description: 'Too many requests' })
  @Get('contacts')
  @Auth(Role.Admin)
  async getContacts(@User() user: UserFromAuth) {
    return this.meService.getContacts(user.sub);
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiOperation({ description: 'Update your contacts.' })
  @ApiBadRequestResponse({ description: 'Bad Request: check your input data.' })
  @ApiOkResponse({ type: ContactsDto, description: 'Ok' })
  @ApiTooManyRequestsResponse({ description: 'Too many requests' })
  @Patch('contacts')
  @Auth(Role.Admin)
  async updateContacts(
    @User() user: UserFromAuth,
    @Body() updateContactsDto: UpdateContactsDto,
  ) {
    return this.meService.updateContacts(user.sub, updateContactsDto);
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiOperation({
    description: 'Get all your projects that you are the created.',
  })
  @ApiTooManyRequestsResponse({ description: 'Too many requests' })
  @ApiBadRequestResponse({
    description: 'Bad Request: check query parameters.',
  })
  @ApiPaginatedResponse(ProjectDto)
  @Get('projects/assigned')
  @Auth(Role.Admin)
  async getAssignedProjects(
    @User() user: UserFromAuth,
    @Query() { offset, limit }: PaginationParams,
  ): Promise<PaginatedResponse<Project>> {
    return this.projectsService.getAssignedProjects(
      user.username,
      offset,
      limit,
    );
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiOperation({
    description: 'Get all your projects in which you are a collaborator.',
  })
  @ApiTooManyRequestsResponse({ description: 'Too many requests' })
  @ApiBadRequestResponse({
    description: 'Bad Request: check query parameters.',
  })
  @ApiPaginatedResponse(ProjectDto)
  @Get('projects')
  @Auth(Role.Admin)
  async getUserProjects(
    @User() user: UserFromAuth,
    @Query() { offset, limit }: PaginationParams,
  ): Promise<PaginatedResponse<Project>> {
    return this.projectsService.getUserProjects(user.username, offset, limit);
  }
}
