import { IsEnum, IsString } from 'class-validator';
import { CreateLabelDto } from './create-label.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';

export class BuyDto extends CreateLabelDto {
  @IsString()
  @ApiProperty()
  title: string; // ini required buat tracking

  @IsString()
  @ApiProperty()
  description: string; // ini required buat tracking

  @IsEnum(PaymentMethod)
  @ApiProperty()
  paymentMethod: PaymentMethod;
}
