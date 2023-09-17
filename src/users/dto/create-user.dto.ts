import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'It should be an email.',
    example: 'my-email@mail.ru',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      'It must be a complex password consisting of at least 8 characters, including capital letters and special characters.',
    example: 'Gam89.jwR',
  })
  @IsStrongPassword({ minLength: 8 })
  password: string;

  @ApiProperty({
    description: 'Enter the user name.',
    example: 'your-username',
  })
  username: string;
}
