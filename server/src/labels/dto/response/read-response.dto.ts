import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { CreateInvoiceResponseDto } from 'src/invoices/dto/response/create-response.dto';
import { meta } from 'src/types/meta.dto';

export class GetLabelResponseDto extends CreateInvoiceResponseDto {}

export class GetAllLabelResponseDto {
  @ApiResponseProperty({ type: [GetLabelResponseDto] })
  @Expose()
  data: GetLabelResponseDto[];

  @ApiResponseProperty()
  @Expose()
  meta: meta;
}
