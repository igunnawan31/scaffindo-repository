import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { meta } from 'src/types/meta.dto';
import { CreateLabelResponseDto } from './create-response.dto';

export class GetLabelResponseDto extends CreateLabelResponseDto {}

export class GetAllLabelResponseDto {
  @ApiResponseProperty({ type: [GetLabelResponseDto] })
  @Expose()
  data: GetLabelResponseDto[];

  @ApiResponseProperty()
  @Expose()
  meta: meta;
}
