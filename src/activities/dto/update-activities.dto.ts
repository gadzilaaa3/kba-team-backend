import { IsUrl } from 'class-validator';

export class UpdateActivitiesDto {
  @IsUrl()
  languages?: string;

  @IsUrl()
  codingActivity?: string;
}
