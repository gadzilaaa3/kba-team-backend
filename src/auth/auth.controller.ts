import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';
import { ForgotDto } from './dto/forgot.dto';
import { ResetDto } from './dto/reset.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Role } from 'src/roles/enums/role.enum';
import { User } from 'src/common/decorators/user.decorator';
import { UserFromAuth } from 'src/common/interfaces/user-from-auth.interface';
import { UseRefreshToken } from 'src/common/decorators/use-refresh-token.decorator';
import { TokensDto } from './dto/tokens.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Created', type: TokensDto })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiTooManyRequestsResponse({ description: 'Too many requests' })
  @Auth(Role.SuperAdmin)
  @Post('register')
  register(@Body() createUserDto: CreateUserDto): Promise<TokensDto> {
    return this.authService.register(createUserDto);
  }

  @ApiCreatedResponse({ description: 'Created', type: TokensDto })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiTooManyRequestsResponse({ description: 'Too many requests' })
  @Post('login')
  login(@Body() data: AuthDto) {
    return this.authService.login(data);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Ok' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiTooManyRequestsResponse({ description: 'Too many requests' })
  @HttpCode(200)
  @UseRefreshToken()
  @Get('logout')
  logout(@User() user: UserFromAuth): Promise<void> {
    return this.authService.logout(user.refreshToken);
  }

  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Created', type: TokensDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiTooManyRequestsResponse({ description: 'Too many requests' })
  @UseRefreshToken()
  @Get('refresh')
  refreshTokens(@User() user: UserFromAuth): Promise<TokensDto> {
    return this.authService.refreshTokens(user.sub, user.refreshToken);
  }

  @ApiOkResponse({ description: 'Ok' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiTooManyRequestsResponse({ description: 'Too many requests' })
  @HttpCode(200)
  @Post('forgot')
  forgotPassword(@Body() forgotDto: ForgotDto) {
    return this.authService.forgotPassword(forgotDto);
  }

  @ApiOkResponse({ description: 'Ok' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiTooManyRequestsResponse({ description: 'Too many requests' })
  @HttpCode(200)
  @Patch('reset')
  resetPassword(@Body() resetDto: ResetDto) {
    return this.authService.resetPassword(resetDto);
  }
}
