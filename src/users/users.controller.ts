import { Controller, Get, HttpCode, Param, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';
import { PaginatedDto } from 'src/common/interfaces/paginated.dto';
import { PaginationParams } from 'src/common/pagination/paginationParams';
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
  @ApiPaginatedResponse(UserDto)
  @ApiBadRequestResponse({
    description: 'Bad Request: check the query parameters.',
  })
  @ApiTooManyRequestsResponse({ description: 'Too many requests' })
  @HttpCode(200)
  @ApiQuery({
    name: 'search',
    type: String,
    required: false,
  })
  @Get()
  async findMany(
    @Query() paginationParams: PaginationParams,
    @Query('search') search?: string,
  ) {
    return this.usersService.findMany(paginationParams, search);
  }

  @ApiOperation({
    description:
      'Find a user by ID, available only to users with the super-admin role',
  })
  @ApiOkResponse({ description: 'Ok', type: UserDto })
  @ApiTooManyRequestsResponse({ description: 'Too many requests' })
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.usersService.findById(id, { password: 0, roles: 0 });
  }
}
