import { Expose } from 'class-transformer';
import { ApiResponseProperty } from '@nestjs/swagger';
import { GetCertificationResponseDto } from 'src/certifications/dto/response/read-response.dto';
import { FileMetaDataResponse } from 'src/types/FileMeta.dto';
export class CreateProductResponseDto {
  @ApiResponseProperty()
  @Expose()
  id: string;

  @ApiResponseProperty()
  @Expose()
  name: string;

  @ApiResponseProperty()
  @Expose()
  description: string;

  @ApiResponseProperty()
  @Expose()
  price: number;

  @ApiResponseProperty()
  @Expose()
  companyId: string;

  @ApiResponseProperty()
  @Expose()
  categories: string[];

  @ApiResponseProperty({ type: [GetCertificationResponseDto] })
  @Expose()
  certifications: GetCertificationResponseDto[];

  @ApiResponseProperty({ type: [FileMetaDataResponse] })
  @Expose()
  image: FileMetaDataResponse[];
}
