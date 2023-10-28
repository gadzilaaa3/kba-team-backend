import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Role } from 'src/roles/enums/role.enum';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateRolesDto } from 'src/users/dto/update-roles.dto';
import { UserDto } from 'src/users/user.interface';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @ApiOperation({ description: 'Create user.' })
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Created', type: UserDto })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiTooManyRequestsResponse({ description: 'Too many requests' })
  @Auth(Role.SuperAdmin)
  @Post('users')
  register(@Body() createUserDto: CreateUserDto) {
    return this.adminService.createUser(createUserDto);
  }

  @ApiOperation({
    description:
      'Change the array of user roles. Available only to users with the super-admin role',
  })
  @ApiBearerAuth()
  @ApiBadRequestResponse({
    description:
      'Bad Request: each value in roles must be one of the following values: user, admin, super-admin',
  })
  @ApiNotFoundResponse({ description: 'Not Found: there is no such user' })
  @ApiConflictResponse({
    description: 'Conflict: you cannot deprive a user of the super admin role',
  })
  @ApiTooManyRequestsResponse({ description: 'Too many requests' })
  @Auth(Role.SuperAdmin)
  @Patch('users/:id/roles')
  setUserRoles(@Param('id') id: string, @Body() { roles }: UpdateRolesDto) {
    return this.adminService.setUserRoles(id, roles);
  }
}
