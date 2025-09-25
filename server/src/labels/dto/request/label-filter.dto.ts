import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { sortOrder } from 'src/types/sortBy.dto';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { LabelStatus } from '@prisma/client';

export class LabelFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(LabelStatus)
  status: LabelStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  productId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  penjualanId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  invoiceId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  minCreatedDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  minUpdatedDate?: string;

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
