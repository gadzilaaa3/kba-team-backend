import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsOptional,
  IsUrl,
  ValidateNested,
} from 'class-validator';

export class UpdateProjectDto {
  @ApiProperty({
    description: 'Name of your project',
    example: 'My First Project',
  })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Project deployment date',
    example: '2023-09-17T16:56:27.144Z',
  })
  @IsOptional()
  @IsDate()
  deploymentDate?: Date;

  @ApiPropertyOptional({
    description: 'Project status',
    example: 'In development',
  })
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({
    description: 'Link to the github repository',
    example: 'https://github.com/username/RandomRepo',
  })
  @IsOptional()
  @IsUrl()
  github?: string;

  @ApiPropertyOptional({
    description: 'Photos of the project',
    example: [
      'https://www.zastavki.com/pictures/originals/2018Animals___Cats_Large_gray_cat_with_a_surprised_look_123712_.jpg',
      'https://img-fotki.yandex.ru/get/9091/122054311.9/0_1b4a4d_aecc1685_orig.jpg',
    ],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IsUrl)
  images?: string[];

  @ApiPropertyOptional({
    description: 'Project description',
    example: 'Our best project.',
  })
  @IsOptional()
  description?: string;
}
