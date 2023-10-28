import { Module } from '@nestjs/common';
import { ActivitiesModule } from 'src/activities/activities.module';
import { ContactsModule } from 'src/contacts/contacts.module';
import { ProjectsModule } from 'src/projects/projects.module';
import { UsersModule } from 'src/users/users.module';
import { MeController } from './me.controller';
import { MeService } from './me.service';

@Module({
  controllers: [MeController],
  providers: [MeService],
  imports: [UsersModule, ActivitiesModule, ContactsModule, ProjectsModule],
})
export class MeModule {}
