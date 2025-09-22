import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CertificationFilterDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @IsDateString()
  @ApiPropertyOptional()
  @IsOptional()
  expired?: string;

  @IsString()
  @ApiPropertyOptional()
  @IsOptional()
  details?: string;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  productId?: number;
}
