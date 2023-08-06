import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Request as RequestType } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import { ForgotDto } from './dto/forgot.dto';
import { ResetDto } from './dto/reset.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signUp')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('signIn')
  signin(@Body() data: AuthDto) {
    return this.authService.signIn(data);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('logout')
  logout(@Request() req: RequestType) {
    return this.authService.logout(req.user['refreshToken']);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Request() req: RequestType) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
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
