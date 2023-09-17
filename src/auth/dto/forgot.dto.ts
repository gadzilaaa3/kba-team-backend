import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotDto {
  @ApiProperty({
    description: 'It should be an email.',
    example: 'my-email@mail.ru',
  })
  @IsEmail()
  email: string;
}
