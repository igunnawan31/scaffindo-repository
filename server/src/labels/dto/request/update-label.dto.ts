import { PartialType } from '@nestjs/mapped-types';
import { CreateLabelDto } from './create-label.dto';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLabelDto extends PartialType(CreateLabelDto) {
  @IsString()
  @ApiProperty()
  title: string; // ini required buat tracking

  @IsString()
  @ApiProperty()
  description: string; // ini required buat tracking
}
