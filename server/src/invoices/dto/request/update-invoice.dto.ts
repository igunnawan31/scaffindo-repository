import { PartialType } from '@nestjs/mapped-types';
import { CreateInvoiceDto } from './create-invoice.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { LabelStatus } from '@prisma/client';

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {
  @ApiProperty()
  @IsEnum(LabelStatus)
  status: LabelStatus;

  @ApiProperty()
  @IsString()
  nextCompanyId: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  title: string; // ini required buat bikin tracking

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  description: string; // ini required buat bikin tracking
}
