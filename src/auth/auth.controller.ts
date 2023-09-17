import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Auth(Role.SuperAdmin)
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  login(@Body() data: AuthDto) {
    return this.authService.login(data);
  }

  @UseRefreshToken()
  @Get('logout')
  logout(@User() user: UserFromAuth) {
    return this.authService.logout(user.refreshToken);
  }

  @UseRefreshToken()
  @Get('refresh')
  refreshTokens(@User() user: UserFromAuth) {
    return this.authService.refreshTokens(user.sub, user.refreshToken);
  }

  @Post('forgot')
  forgotPassword(@Body() forgotDto: ForgotDto) {
    return this.authService.forgotPassword(forgotDto);
  }

  @Post('reset')
  resetPassword(@Body() resetDto: ResetDto) {
    return this.authService.resetPassword(resetDto);
  }

  // @UseGuards(LocalAuthGuard)
  // @Post('login')
  // async login(@Request() req: RequestType) {
  //   return req.user;
  // }
}
