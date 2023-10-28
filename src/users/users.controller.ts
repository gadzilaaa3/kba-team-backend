import { Controller, Get, HttpCode, Param, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';
import { Auth } from 'src/common/decorators/auth.decorator';
import { PaginatedDto } from 'src/common/interfaces/paginated.dto';
import { PaginationParams } from 'src/common/pagination/paginationParams';
import { Role } from 'src/roles/enums/role.enum';
import { UserDto } from './user.interface';
import { UsersService } from './users.service';

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
}
