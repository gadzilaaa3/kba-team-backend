import { ApiProperty } from '@nestjs/swagger';

export class TokensDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTJkNmU5NGJhNDI1MGU0YzcxODUxMzgiLCJ1c2VybmFtZSI6ImdhZHppbGFhYTMiLCJyb2xlcyI6WyJzdXBlci1hZG1pbiJdLCJpYXQiOjE2OTc3MjUzMTEsImV4cCI6MTY5Nzc4NTMxMX0.v64I7E6eXDCF4ovFkdEJhDbVWVu7K7wR_ubBeIze6Y4',
  })
  accessToken: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTJkNmU5NGJhNDI1MGU0YzcxODUxMzgiLCJ1c2VybmFtZSI6ImdhZHppbGFhYTMiLCJyb2xlcyI6WyJzdXBlci1hZG1pbiJdLCJpYXQiOjE2OTc3MjUzMTEsImV4cCI6MTY5ODMzMDExMX0.xd7L2R2Hmfgo4WELUlwVWgge1Q8dlRd5Dk_0BBYXsg8',
  })
  refreshToken: string;
}
