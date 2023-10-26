import { ApiProperty } from '@nestjs/swagger';
import { ActivitiesDto } from 'src/activities/activities.interface';
import { ContactsDto } from 'src/contacts/contacts.interface';

export class UserDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  activities: ActivitiesDto;

  @ApiProperty()
  contacts: ContactsDto;
}
