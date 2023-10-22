import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserDto } from 'src/users/user.interface';

export class ProjectDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  assigned: UserDto;

  @ApiProperty({
    isArray: true,
    type: UserDto,
  })
  collaborators: UserDto[];

  @ApiPropertyOptional()
  deploymentDate?: Date;

  @ApiPropertyOptional()
  status?: string;

  @ApiPropertyOptional()
  github?: string;

  @ApiPropertyOptional({
    isArray: true,
    type: String,
  })
  images?: string[];

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
