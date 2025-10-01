import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { sortOrder } from 'src/types/sortBy.dto';

export class PenjualanFilterDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  minCreatedDate?: string;

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
