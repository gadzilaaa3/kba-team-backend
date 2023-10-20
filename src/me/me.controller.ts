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
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Me')
@Controller('me')
export class MeController {
  constructor(private meService: MeService) {}

  @Get()
  @Auth(Role.Admin)
  async getYourSelf(@User() user: UserFromAuth) {
    return this.meService.getYourSelf(user.sub);
  }

  @Get('activities')
  @Auth(Role.Admin)
  async getActivities(@User() user: UserFromAuth) {
    return this.meService.getActivities(user.sub);
  }

  @Patch('activities')
  @Auth(Role.Admin)
  async updateActivities(
    @User() user: UserFromAuth,
    @Body() updateActivitiesDto: UpdateActivitiesDto,
  ) {
    return this.meService.updateActivities(user.sub, updateActivitiesDto);
  }

  @Get('contacts')
  @Auth(Role.Admin)
  async getContacts(@User() user: UserFromAuth) {
    return this.meService.getContacts(user.sub);
  }

  @Patch('activities')
  @Auth(Role.Admin)
  async updateContacts(
    @User() user: UserFromAuth,
    @Body() updateContactsDto: UpdateContactsDto,
  ) {
    return this.meService.updateContacts(user.sub, updateContactsDto);
  }

  @Get('projects/assigned')
  @Auth(Role.Admin)
  async getAssignedProjects(
    @User() user: UserFromAuth,
    @Query() { offset, limit }: PaginationParams,
    @Query('sort') sort: string,
    @Query('fields') fields: string,
  ): Promise<PaginatedResponse<Project>> {
    return this.meService.getAssignedProjects(
      user.sub,
      offset,
      sort,
      limit,
      fields,
    );
  }

  @Get('projects')
  @Auth(Role.Admin)
  async getUserProjects(
    @User() user: UserFromAuth,
    @Query() { offset, limit }: PaginationParams,
    @Query('sort') sort: string,
    @Query('fields') fields: string,
  ): Promise<PaginatedResponse<Project>> {
    return this.meService.getUserProjects(
      user.sub,
      offset,
      sort,
      limit,
      fields,
    );
  }
}
