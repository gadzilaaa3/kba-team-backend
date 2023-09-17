import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Role } from 'src/roles/enums/role.enum';
import { User } from 'src/common/decorators/user.decorator';
import { UserFromAuth } from 'src/common/interfaces/user-from-auth.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Auth(Role.User)
  @Post()
  create(
    @Body() createProjectDto: CreateProjectDto,
    @User() user: UserFromAuth,
  ) {
    return this.projectsService.create(createProjectDto, user.sub);
  }

  @Auth(Role.User)
  @Get()
  findAll(@User() user: UserFromAuth) {
    return this.projectsService.findAll();
  }
}
