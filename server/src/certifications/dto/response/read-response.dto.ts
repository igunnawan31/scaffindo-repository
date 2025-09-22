import { ApiResponseProperty } from '@nestjs/swagger';
import { CreateCertificationResponseDto } from './create-response.dto';
import { Expose } from 'class-transformer';
import { meta } from 'src/types/meta.dto';

export class GetCertificationResponseDto extends CreateCertificationResponseDto {}

export class GetAllCertificationResponseDto {
  @Expose()
  @ApiResponseProperty({ type: [GetCertificationResponseDto] })
  data: GetCertificationResponseDto[];

  @Expose()
  @ApiResponseProperty({ type: meta })
  meta: meta;
}
