import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({
    description: 'Username.',
    example: 'beautifull-username',
  })
  username: string;

  @ApiProperty({
    description: 'User Password.',
    example: '1234asdfsGF.',
  })
  password: string;
}
