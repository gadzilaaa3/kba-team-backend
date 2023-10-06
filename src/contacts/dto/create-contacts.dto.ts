import { IsEmail, IsUrl } from 'class-validator';

export class CreateContactsDto {
  telegram?: string;

  @IsUrl()
  github?: string;

  @IsEmail()
  contactMail?: string;
}
