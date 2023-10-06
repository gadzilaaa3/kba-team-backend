import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ContactsModule } from 'src/contacts/contacts.module';
import { ActivitiesModule } from 'src/activities/activities.module';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule,
    ContactsModule,
    ActivitiesModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
