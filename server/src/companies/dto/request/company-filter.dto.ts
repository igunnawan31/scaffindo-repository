import { ApiPropertyOptional } from '@nestjs/swagger';
import { CompanyType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { sortOrder } from 'src/types/sortBy.dto';

export class CompanyFilterDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  searchTerm?: string;

  @ApiPropertyOptional()
  @IsEnum(CompanyType)
  @IsOptional()
  companyType?: CompanyType;

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
