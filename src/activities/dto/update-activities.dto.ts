import { IsOptional, IsUrl } from 'class-validator';

export class UpdateActivitiesDto {
  @IsOptional()
  @IsUrl()
  languages?: string;

  @IsOptional()
  @IsUrl()
  codingActivity?: string;
}
