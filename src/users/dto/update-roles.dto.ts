import { IsArray, IsEnum } from 'class-validator';
import { Role } from 'src/roles/enums/role.enum';

export class UpdateRolesDto {
  @IsArray()
  @IsEnum(Role, { each: true })
  roles: Role[];
}
