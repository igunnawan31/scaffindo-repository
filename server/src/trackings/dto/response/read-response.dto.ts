import { ApiResponseProperty } from '@nestjs/swagger';
import { Role, TrackStatus } from '@prisma/client';
import { Expose } from 'class-transformer';

export class GetTrackingResponseDto {
  @ApiResponseProperty()
  @Expose()
  id: string;

  @ApiResponseProperty()
  @Expose()
  userId: string;

  @ApiResponseProperty()
  @Expose()
  role: Role;

  @ApiResponseProperty()
  @Expose()
  title: string;

  @ApiResponseProperty()
  @Expose()
  description: string;

  @ApiResponseProperty()
  @Expose()
  status: TrackStatus;

  @ApiResponseProperty()
  @Expose()
  createdAt: string;

  @ApiResponseProperty()
  @Expose()
  labelId: string;

  @ApiResponseProperty()
  @Expose()
  companyId: string;
}
