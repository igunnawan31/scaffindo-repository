import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';

export class CertificationDto {
  @ApiProperty()
  @IsString()
  name: string;

  @IsDateString()
  @ApiProperty()
  expired: string;

  @IsString()
  @ApiProperty()
  details: string;
}
