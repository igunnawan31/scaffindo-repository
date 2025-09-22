import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';
import { sortOrder } from 'src/types/sortBy.dto';

export class CertificationFilterDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  searchTerm?: string;

  @IsDateString()
  @ApiPropertyOptional()
  @IsOptional()
  expired?: string;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  productId?: number;

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
