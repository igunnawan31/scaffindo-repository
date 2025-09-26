import { ApiResponseProperty } from '@nestjs/swagger';
import { CreateCompanyResponseDto } from './create-response.dto';
import { Expose } from 'class-transformer';
import { meta } from 'src/types/meta.dto';

export class GetCompanyResponseDto extends CreateCompanyResponseDto {
  @ApiResponseProperty()
  @Expose()
  users: string[];

  @ApiResponseProperty()
  @Expose()
  products: number[];

  @ApiResponseProperty()
  @Expose()
  trackings: string[];

  @Expose()
  @ApiResponseProperty()
  currentInvoices: string[];

  @Expose()
  @ApiResponseProperty()
  incomingInvoices: string[];
}

export class GetAllCompanyResponseDto {
  data: GetCompanyResponseDto[];
  meta: meta;
}
