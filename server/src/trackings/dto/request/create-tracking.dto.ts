import { ApiProperty } from '@nestjs/swagger';
import { TrackStatus } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

// Ga dipake, cuma buat base DTO aja
export class CreateTrackingDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsEnum(TrackStatus)
  status: TrackStatus;

  @ApiProperty()
  @IsString()
  labelId: string;
}
