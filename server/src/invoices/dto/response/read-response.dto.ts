import { Expose } from 'class-transformer';
import { CreateInvoiceResponseDto } from './create-response.dto';
import { ApiResponseProperty } from '@nestjs/swagger';
import { meta } from 'src/types/meta.dto';

export class GetInvoiceResponseDto extends CreateInvoiceResponseDto {}

export class GetAllInvoiceResponseDto {
  @Expose()
  @ApiResponseProperty({ type: [GetInvoiceResponseDto] })
  data: GetInvoiceResponseDto[];

  @Expose()
  @ApiResponseProperty({ type: meta })
  meta: meta;
}
