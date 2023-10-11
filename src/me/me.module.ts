import { Module } from '@nestjs/common';
import { MeController } from './me.controller';
import { MeService } from './me.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ActivitiesModule } from 'src/activities/activities.module';
import { ContactsModule } from 'src/contacts/contacts.module';
import { ProjectsModule } from 'src/projects/projects.module';

@Module({
  controllers: [MeController],
  providers: [MeService],
  imports: [
    UsersModule,
    JwtModule,
    ActivitiesModule,
    ContactsModule,
    ProjectsModule,
  ],
})
export class MeModule {}
