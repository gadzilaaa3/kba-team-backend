import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { UserWithoutPassword } from './interfaces/userWithoutPassword';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { TokensService } from 'src/tokens/tokens.service';
import { AuthDto } from './dto/auth.dto';
import { ForgotDto } from './dto/forgot.dto';
import { ResetDto } from './dto/reset.dto';
import { ResetTokensService } from 'src/reset-tokens/reset-tokens.service';
import { MailService } from 'src/mail/mail.service';
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
  private static saltRounds = 15;

  async validateUser(
    username: string,
    pass: string,
  ): Promise<UserWithoutPassword> {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      return null;
    }

    const comparingResult = await bcrypt.compare(pass, user.password);
    if (!comparingResult) {
      return null;
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    // Check if user exists
    const userExists = await this.usersService.findByUsername(
      createUserDto.username,
    );
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    // Hash password
    const hash = await this.hashData(createUserDto.password);
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hash,
    });
    const tokens = await this.getTokens(newUser.id, newUser.username);
    await this.saveRefreshToken(newUser.id, tokens.refreshToken);
    return tokens;
  }

  async signIn(authDto: AuthDto) {
    // Check if user exists
    const user = await this.usersService.findByUsername(authDto.username);
    if (!user) throw new BadRequestException('User does not exist');

    const passwordMatches = await bcrypt.compare(
      authDto.password,
      user.password,
    );
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');

    const tokens = await this.getTokens(user.id, user.username);
    //await this.deleteExpiredUserTokens(user.id);

    // If there are more than a certain number of sessions, then delete the oldest session
    await this.checkCountUserSessions(user.id);

    await this.saveRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(refreshToken: string) {
    const token = await this.tokensService.findOneByToken(refreshToken);
    if (!token) {
      throw new ForbiddenException();
    }
    await this.tokensService.remove(token.id);
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
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

    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokenDb.id, tokens.refreshToken);
    return tokens;
  }

  async forgotPassword(forgotDto: ForgotDto) {
    const user = await this.usersService.findByEmail(forgotDto.email);

    if (!user) {
      throw new BadRequestException('This user does not exist');
    }

    await this.resetTokensService.removeAllUserTokens(user.id);

    const token = await this.generateResetToken(user.email);

    const createResetTokenDto = {
      userId: user.id,
      token,
    };
    this.resetTokensService.create(createResetTokenDto);

    this.mailService.sendForgotToken(user, token);
  }

  async resetPassword(resetDto: ResetDto) {
    const user = await this.usersService.findByEmail(resetDto.email);
    if (!user) {
      throw new BadRequestException('This user does not exist');
    }

    const resetToken = await this.resetTokensService.findOneByUserId(user.id);
    if (!resetToken) {
      throw new ForbiddenException('Access Denied');
    }
    if (resetToken.token !== resetDto.token) {
      throw new ForbiddenException('Access Denied');
    }

    const hashedPassword = await this.hashData(resetDto.password);
    const updatedUser = { password: hashedPassword };
    await this.usersService.update(user.id, updatedUser);
    await this.resetTokensService.removeAllUserTokens(user.id);
  }

  private async generateResetToken(email: string): Promise<string> {
    return await this.hashData(`${email}` + new Date());
  }

  private async checkCountUserSessions(userId: string) {
    const tokens = await this.tokensService.findAllByUserId(userId);
    if (tokens.length >= AuthService.countUserSession) {
      this.tokensService.remove(tokens[0].id);
    }
  }

  private async hashData(data: string) {
    const salt = await bcrypt.genSalt(AuthService.saltRounds);
    return await bcrypt.hash(data, salt);
  }

  private async saveRefreshToken(userId: string, refreshToken: string) {
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
  ) {
    await this.tokensService.remove(oldRefreshTokenId);
    this.saveRefreshToken(userId, newRefreshToken);
  }

  private async deleteExpiredUserTokens(userId: string) {
    const userTokens = await this.tokensService.findAllByUserId(userId);
    for (let i = 0; i < userTokens.length; i++) {
      const token = userTokens[i];

      try {
        await this.jwtService.verifyAsync(token.refreshToken, {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        });
      } catch (e) {
        await this.tokensService.remove(token.id);
      }
    }
  }

  private async getTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: TokenExpires.accessTokenExpires,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
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
