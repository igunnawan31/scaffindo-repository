import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCertificationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  @ApiProperty()
  @IsNotEmpty()
  expired: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  details: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  productId?: number;
}
