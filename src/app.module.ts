import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { LinksModule } from './links/links.module';
import { ImagesModule } from './images/images.module';
import { TechnologiesModule } from './technologies/technologies.module';
import { ProjectsModule } from './projects/projects.module';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { TokensModule } from './tokens/tokens.module';
import { MailModule } from './mail/mail.module';
import { ResetTokensModule } from './reset-tokens/reset-tokens.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    LinksModule,
    ImagesModule,
    TechnologiesModule,
    ProjectsModule,
    RolesModule,
    AuthModule,
    TokensModule,
    MailModule,
    ResetTokensModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
