import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEmail, IsEnum, IsStrongPassword } from 'class-validator';
import { Role } from 'src/roles/enums/role.enum';

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

  @ApiPropertyOptional({
    enum: Role,
    isArray: true,
    example: [Role.User, Role.Admin, Role.SuperAdmin],
  })
  @IsArray()
  @IsEnum(Role, { each: true })
  roles?: Role[];
}
