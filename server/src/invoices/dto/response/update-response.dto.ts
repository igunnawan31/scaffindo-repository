import { PartialType } from '@nestjs/mapped-types';
import { CreateInvoiceResponseDto } from './create-response.dto';

export class UpdateInvoiceResponseDto extends PartialType(
  CreateInvoiceResponseDto,
) {}
