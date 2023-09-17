import { Role } from 'src/roles/enums/role.enum';

export interface UserFromAuth {
  sub: string;

  roles: Role[];

  username: string;

  refreshToken?: string;
}
