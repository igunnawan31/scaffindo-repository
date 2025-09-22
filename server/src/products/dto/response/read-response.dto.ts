import { meta } from 'src/types/meta.dto';
import { CreateProductResponseDto } from './create-response.dto';
import { Expose } from 'class-transformer';
import { ApiResponseProperty } from '@nestjs/swagger';

export class GetProductResponseDto extends CreateProductResponseDto {}

export class GetAllProductResponseDto {
  @Expose()
  @ApiResponseProperty({ type: [GetProductResponseDto] })
  data: GetProductResponseDto[];

  @Expose()
  @ApiResponseProperty({ type: meta })
  meta: meta;
}
