import { Body, Controller, Get, HttpCode, Patch, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UseRefreshToken } from 'src/common/decorators/use-refresh-token.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { UserFromAuth } from 'src/common/interfaces/user-from-auth.interface';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ForgotDto } from './dto/forgot.dto';
import { ResetDto } from './dto/reset.dto';
import { TokensDto } from './dto/tokens.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
