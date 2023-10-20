import { ApiProperty } from '@nestjs/swagger';
import { Activities } from 'src/activities/activities.interface';
import { Contacts } from 'src/contacts/contacts.interface';

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
  activities: Activities;

  @ApiProperty()
  contacts: Contacts;
}

export class PaginatedDto<TData> {
  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;

  @ApiProperty()
  total: number;

  items: TData[];
}
