import { PartialType } from '@nestjs/mapped-types';
import { CreateInvoiceDto } from './create-invoice.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { LabelStatus } from '@prisma/client';

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {
  @ApiProperty()
  @IsEnum(LabelStatus)
  status: LabelStatus;

  @IsString()
  @ApiProperty()
  title: string; // ini required buat bikin tracking

  @IsString()
  @ApiProperty()
  description: string; // ini required buat bikin tracking
}
