import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { HashService } from 'src/common/services/hash.service';
import { MailService } from 'src/mail/mail.service';
import { ResetTokensService } from 'src/reset-tokens/reset-tokens.service';
import { TokensService } from 'src/tokens/tokens.service';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './dto/auth.dto';
import { ForgotDto } from './dto/forgot.dto';
import { ResetDto } from './dto/reset.dto';
import { TokensDto } from './dto/tokens.dto';
import { UserDto } from './dto/user.dto';
import { TokenExpires } from './tokenExpires';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private usersService: UsersService,
    private tokensService: TokensService,
    private resetTokensService: ResetTokensService,
    private mailService: MailService,
  ) {}

  private static countUserSession = 2;

  async login(authDto: AuthDto): Promise<TokensDto> {
    // Check if user exists
    const user = await this.usersService.findOne(
      {
        username: authDto.username,
      },
      {
        _id: true,
        username: true,
        password: true,
        roles: true,
      },
    );
    if (!user) throw new NotFoundException('User does not exist');

    const passwordMatches = await bcrypt.compare(
      authDto.password,
      user.password,
    );
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');

    const tokens = await this.getTokens(user);
    //await this.deleteExpiredUserTokens(user.id);

    // If there are more than a certain number of sessions, then delete the oldest session
    await this.checkCountUserSessions(user.id);

    await this.saveRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(refreshToken: string): Promise<void> {
    const token = await this.tokensService.findOneByToken(refreshToken);
    if (!token) {
      throw new ForbiddenException();
    }
    await this.tokensService.remove(token.id);
  }

  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<TokensDto> {
    const user = await this.usersService.findById(userId, { password: 0 });
    if (!user) {
      throw new ForbiddenException('Access Denied');
    }

    // Токен обновления дествительный, но в БД отсутствует, удаяляем все токены обновления этого пользователя из БД.
    const tokenDb = await this.tokensService.findOneByToken(
      refreshToken,
      userId,
    );
    if (!tokenDb) {
      await this.tokensService.removeAllUserToken(user.id);
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user.id, tokenDb.id, tokens.refreshToken);
    return tokens;
  }

  async forgotPassword(forgotDto: ForgotDto): Promise<void> {
    const user = await this.usersService.findOne({
      email: forgotDto.email,
    });

    if (!user) {
      throw new NotFoundException('This user does not exist');
    }

    await this.resetTokensService.removeAllUserTokens(user.id);

    const token = await this.generateResetToken(user.email);

    const createResetTokenDto = {
      userId: user.id,
      token,
    };
    await this.resetTokensService.create(createResetTokenDto);
    await this.mailService.sendForgotToken(user, token);
  }

  async resetPassword(resetDto: ResetDto): Promise<void> {
    const user = await this.usersService.findOne({
      email: resetDto.email,
    });
    if (!user) {
      throw new NotFoundException('This user does not exist');
    }

    const resetToken = await this.resetTokensService.findOneByUserId(user.id);
    if (!resetToken) {
      throw new ForbiddenException('Access Denied');
    }
    if (resetToken.token !== resetDto.token) {
      throw new ForbiddenException('Access Denied');
    }

    const hashedPassword = await HashService.hashData(resetDto.password);
    const updatedUser = { password: hashedPassword };
    await this.usersService.update(user.id, updatedUser);
    await this.resetTokensService.removeAllUserTokens(user.id);
  }

  private async generateResetToken(email: string): Promise<string> {
    return await HashService.hashData(`${email}` + new Date());
  }

  private async checkCountUserSessions(userId: string): Promise<void> {
    const tokens = await this.tokensService.findAllByUserId(userId);
    if (tokens.length >= AuthService.countUserSession) {
      this.tokensService.remove(tokens[0].id);
    }
  }

  private async saveRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const delayInSeconds = 5;

    const expiresIn = new Date();
    expiresIn.setSeconds(
      expiresIn.getSeconds() +
        TokenExpires.refreshTokenExpires -
        delayInSeconds,
    );

    //const hashedRefreshToken = await this.hashData(refreshToken);
    await this.tokensService.create({
      userId,
      //refreshToken: hashedRefreshToken,
      refreshToken,
      expiresIn,
    });
  }

  private async updateRefreshToken(
    userId: string,
    oldRefreshTokenId: string,
    newRefreshToken: string,
  ): Promise<void> {
    await this.tokensService.remove(oldRefreshTokenId);
    this.saveRefreshToken(userId, newRefreshToken);
  }

  private async getTokens(user: UserDto): Promise<TokensDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user.id,
          username: user.username,
          roles: user.roles,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: TokenExpires.accessTokenExpires,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user.id,
          username: user.username,
          roles: user.roles,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: TokenExpires.refreshTokenExpires,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
