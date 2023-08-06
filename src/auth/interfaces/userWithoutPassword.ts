import { User } from 'src/users/schemas/user.schema';

export type UserWithoutPassword = Omit<User, 'password'>;
