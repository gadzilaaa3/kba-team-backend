import { IsEmail, IsUrl } from 'class-validator';

export class UpdateContactsDto {
  telegram?: string;

  @IsUrl()
  github?: string;

  @IsEmail()
  contactMail?: string;
}
