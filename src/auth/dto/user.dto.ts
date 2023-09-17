import { Role } from 'src/roles/enums/role.enum';

export interface UserDto {
  id?: string;

  email: string;

  username: string;

  roles: String[];
}
