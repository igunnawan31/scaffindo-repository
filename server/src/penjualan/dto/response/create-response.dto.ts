import { ApiResponseProperty } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';
import { Expose } from 'class-transformer';

// Ga kepake cuma buat base aja
export class CreatePenjualanResponseDto {
  @Expose()
  @ApiResponseProperty()
  id: string;

  @Expose()
  @ApiResponseProperty()
  labelIds: string[];

  @Expose()
  @ApiResponseProperty()
  totalHarga: number;

  @Expose()
  @ApiResponseProperty()
  paymentMethod: PaymentMethod;

  @Expose()
  @ApiResponseProperty()
  createdAt: string;
}
