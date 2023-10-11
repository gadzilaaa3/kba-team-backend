import {
  Body,
  Controller,
  Delete,
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

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Auth(Role.Admin)
  @Get()
  findMany(
    @Query() { offset, limit }: PaginationParams,
    @Query('sort') sort: string,
    @Query('fields') fields: string,
  ): Promise<PaginateResponse<Project>> {
    return this.projectsService.findMany(offset, limit, sort, fields);
  }

  @Auth(Role.Admin)
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

  @Auth(Role.Admin)
  @Patch()
  update() {}

  @Auth(Role.Admin)
  @Delete(':id')
  delete(@Param('id', ValidateMongoId) id: string, @User() user: UserFromAuth) {
    return this.projectsService.delete(id, user.sub);
  }
}
