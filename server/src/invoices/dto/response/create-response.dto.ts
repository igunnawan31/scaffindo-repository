import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreateInvoiceResponseDto {
  @ApiResponseProperty()
  @Expose()
  id: string;

  @ApiResponseProperty()
  @Expose()
  PICIds: string[];

  @ApiResponseProperty()
  @Expose()
  labelIds: string[];

  @ApiResponseProperty()
  @Expose()
  productId: number;
}
