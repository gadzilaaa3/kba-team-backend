import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class FindManyParams {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;

  @IsOptional()
  search?: string;

  @IsOptional()
  sort?: string;

  @IsOptional()
  fields?: string;
}
