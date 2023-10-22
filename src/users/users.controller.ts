import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Role } from 'src/roles/enums/role.enum';
import { Auth } from 'src/common/decorators/auth.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateRolesDto } from './dto/update-roles.dto';
import { PaginationParams } from 'src/common/pagination/paginationParams';
import { UserDto } from './user.interface';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';
import { PaginatedDto } from 'src/common/interfaces/paginated.dto';

@ApiTags('Users')
@Controller('users')
@ApiExtraModels(PaginatedDto)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({
    description:
      'Find all users with pagination, available only to users with the super-admin role',
  })
  @ApiBearerAuth()
  @ApiPaginatedResponse(UserDto)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiTooManyRequestsResponse({ description: 'Too many requests' })
  @HttpCode(200)
  @Auth(Role.SuperAdmin)
  @Get()
  async findMany(@Query() paginationParams: PaginationParams) {
    return this.usersService.findMany(paginationParams);
  }

  @ApiOperation({
    description:
      'Find a user by ID, available only to users with the super-admin role',
  })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Ok', type: UserDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiTooManyRequestsResponse({ description: 'Too many requests' })
  @Auth(Role.SuperAdmin)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.usersService.findById(id, { password: 0, roles: 0 });
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
  @Patch(':id/roles')
  setRoles(@Param('id') id: string, @Body() { roles }: UpdateRolesDto) {
    return this.usersService.setRoles(id, roles);
  }
}
