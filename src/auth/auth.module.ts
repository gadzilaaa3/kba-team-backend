import { Module } from '@nestjs/common';
import { MailModule } from 'src/mail/mail.module';
import { ResetTokensModule } from 'src/reset-tokens/reset-tokens.module';
import { TokensModule } from 'src/tokens/tokens.module';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  imports: [UsersModule, TokensModule, ResetTokensModule, MailModule],
})
export class AuthModule {}
