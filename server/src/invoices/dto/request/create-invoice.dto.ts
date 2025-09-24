import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class CreateInvoiceDto {
  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  productId: number;

  // @ApiProperty()
  // @IsArray()
  // @ArrayNotEmpty()
  // @IsString({ each: true })
  // @Transform(({ value }): string[] => {
  //   if (typeof value === 'string') {
  //     return JSON.parse(value);
  //   }
  //   return value;
  // })
  // PICIds: string[];

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  totalLabel: number;
}
