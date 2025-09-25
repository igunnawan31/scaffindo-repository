import { ApiResponseProperty } from '@nestjs/swagger';
import { LabelStatus } from '@prisma/client';
import { Expose } from 'class-transformer';

// Ga dipake, cm buat base DTO aja
export class CreateLabelResponseDto {
  @ApiResponseProperty()
  @Expose()
  id: string;

  @ApiResponseProperty()
  @Expose()
  status: LabelStatus;

  @ApiResponseProperty()
  @Expose()
  productId: string;

  @ApiResponseProperty()
  @Expose()
  invoiceId: string;

  @ApiResponseProperty()
  @Expose()
  penjualanId: string;

  @ApiResponseProperty()
  @Expose()
  trackingIds: string[];

  @ApiResponseProperty()
  @Expose()
  createdAt: string;

  @ApiResponseProperty()
  @Expose()
  updatedAt: string;
}
