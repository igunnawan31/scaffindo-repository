import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsInt, IsString } from 'class-validator';

export class CreateInvoiceDto {
  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  productId: number;

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @Transform(({ value }): string[] => {
    if (typeof value === 'string') {
      return JSON.parse(value);
    }
    return value;
  })
  PICIds: string[];

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  totalLabel: number;
}
