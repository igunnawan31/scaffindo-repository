import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { FileMetaDataResponse } from 'src/types/FileMeta.dto';

export class CreateCertificationResponseDto {
  @ApiResponseProperty()
  @Expose()
  id: string;

  @ApiResponseProperty()
  @Expose()
  name: string;

  @ApiResponseProperty()
  @Expose()
  expired: string;

  @ApiResponseProperty()
  @Expose()
  details: string;

  @ApiResponseProperty({ type: [FileMetaDataResponse] })
  @Expose()
  document: FileMetaDataResponse[];

  @ApiResponseProperty()
  @Expose()
  productId: string;
}
