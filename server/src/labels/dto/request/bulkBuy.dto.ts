import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { BuyDto } from './buy.dto';

export class BulkBuyDto extends BuyDto {
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  @Transform(({ value }): string[] => {
    if (typeof value === 'string') {
      return JSON.parse(value);
    }
    return value;
  })
  labelIds: string[];
}
