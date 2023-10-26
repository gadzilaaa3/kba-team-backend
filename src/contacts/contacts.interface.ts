import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ContactsDto {
  @ApiProperty()
  _id: string;

  @ApiPropertyOptional()
  telegram?: string;

  @ApiPropertyOptional()
  github?: string;

  @ApiPropertyOptional()
  contactMail?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updateAt: Date;
}
