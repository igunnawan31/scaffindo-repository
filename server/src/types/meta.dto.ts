import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class meta {
  @ApiResponseProperty()
  @Expose()
  total: number;
  @ApiResponseProperty()
  @Expose()
  page: number;
  @ApiResponseProperty()
  @Expose()
  limit: number;
  @ApiResponseProperty()
  @Expose()
  totalPages: number;
}
