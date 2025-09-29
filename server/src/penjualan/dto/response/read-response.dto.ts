import { meta } from 'src/types/meta.dto';
import { CreatePenjualanResponseDto } from './create-response.dto';
import { Expose } from 'class-transformer';
import { ApiResponseProperty } from '@nestjs/swagger';

export class GetPenjualanResponseDto extends CreatePenjualanResponseDto {}

export class GetAllPenjualanResponseDto {
  @Expose()
  @ApiResponseProperty({ type: [GetPenjualanResponseDto] })
  data: GetPenjualanResponseDto[];

  @Expose()
  @ApiResponseProperty()
  meta: meta;
}
