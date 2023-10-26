import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ActivitiesDto {
  @ApiProperty()
  _id: string;

  @ApiPropertyOptional()
  languages?: string;

  @ApiPropertyOptional()
  codingActivity?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
