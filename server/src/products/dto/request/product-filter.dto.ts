import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, IsInt } from 'class-validator';
import { sortOrder } from 'src/types/sortBy.dto';

export class productFilterDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  searchTerm?: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  minPrice?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  companyId?: string;

  @ApiPropertyOptional()
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

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  sortBy?: string;

  @IsOptional()
  @ApiPropertyOptional({
    enum: sortOrder,
    enumName: 'SortOrder',
    description: 'Sort order: asc or desc',
  })
  sortOrder?: 'asc' | 'desc';
}
