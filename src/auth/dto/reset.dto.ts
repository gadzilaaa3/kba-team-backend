import { IsEmail, IsStrongPassword } from 'class-validator';

export class ResetDto {
  @IsEmail()
  email: string;
  token: string;
  @IsStrongPassword({ minLength: 8 })
  password: string;
}
