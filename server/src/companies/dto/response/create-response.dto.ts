import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreateCompanyResponseDto {
  @Expose()
  @ApiResponseProperty()
  id: string;

  @Expose()
  @ApiResponseProperty()
  name: string;
}
