import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum } from 'class-validator';
import { Role } from 'src/roles/enums/role.enum';

export class UpdateRolesDto {
  @ApiProperty({
    enum: Role,
    isArray: true,
    example: [Role.User, Role.Admin, Role.SuperAdmin],
  })
  @IsArray()
  @IsEnum(Role, { each: true })
  roles: Role[];
}
