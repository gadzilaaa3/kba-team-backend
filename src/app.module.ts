import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ActivitiesModule } from './activities/activities.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { ContactsModule } from './contacts/contacts.module';
import { GlobalJwtModule } from './global-jwt/global-jwt.module';
import { ImagesModule } from './images/images.module';
import { MailModule } from './mail/mail.module';
import { MeModule } from './me/me.module';
import { ProjectsModule } from './projects/projects.module';
import { ResetTokensModule } from './reset-tokens/reset-tokens.module';
import { RolesModule } from './roles/roles.module';
import { TokensModule } from './tokens/tokens.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 20,
      },
    ]),
    UsersModule,
    ImagesModule,
    ProjectsModule,
    RolesModule,
    AuthModule,
    TokensModule,
    MailModule,
    ResetTokensModule,
    ContactsModule,
    ActivitiesModule,
    MeModule,
    AdminModule,
    GlobalJwtModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
