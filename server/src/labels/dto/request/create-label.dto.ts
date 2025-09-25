import { ApiProperty } from '@nestjs/swagger';
import { LabelStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

// Ga dipake, cm buat base DTO aja
export class CreateLabelDto {
  @ApiProperty()
  @IsEnum(LabelStatus)
  status: LabelStatus;
}
