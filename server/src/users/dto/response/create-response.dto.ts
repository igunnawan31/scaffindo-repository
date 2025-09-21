import { ApiHideProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Exclude } from 'class-transformer';
import { Role, SubRole } from '@prisma/client';

export class CreateUserResponseDto {
  @Expose()
  @ApiResponseProperty()
  name: string;

  @Expose()
  @ApiResponseProperty()
  email: string;

  @Exclude()
  @ApiHideProperty()
  password: string;

  @Expose()
  @ApiResponseProperty()
  companyId: string;

  @Expose()
  @ApiResponseProperty()
  role: Role;

  @Expose()
  @ApiResponseProperty()
  subRole: SubRole;

  @Expose()
  @ApiResponseProperty({})
  InvoiceIds: string[];

  @Expose()
  @ApiResponseProperty()
  trackingIds: string[];
}
