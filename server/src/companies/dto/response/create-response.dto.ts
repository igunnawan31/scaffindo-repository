import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { CompanyType } from '@prisma/client';

export class CreateCompanyResponseDto {
  @Expose()
  @ApiResponseProperty()
  id: string;

  @Expose()
  @ApiResponseProperty()
  name: string;

  @Expose()
  @ApiResponseProperty()
  companyType: CompanyType;
}
