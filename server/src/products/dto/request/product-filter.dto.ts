import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, IsInt } from 'class-validator';

export class productFilterDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  searchTerm?: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  minPrice?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  companyId?: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }): string[] => {
    if (typeof value === 'string') {
      return JSON.parse(value);
    }
    return value;
  })
  categories?: string[];

  @ApiProperty()
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  limit?: number;
}
