import { ApiProperty } from '@nestjs/swagger';

export class UpdateCollaboratorsDto {
  @ApiProperty()
  username: string;
}
