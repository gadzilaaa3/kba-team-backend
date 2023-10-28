import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivitiesModule } from 'src/activities/activities.module';
import { ContactsModule } from 'src/contacts/contacts.module';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ContactsModule,
    ActivitiesModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
