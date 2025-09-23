import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsInt,
  IsOptional,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CertificationDto } from 'src/certifications/dto/request/CertificationProduct.dto';
export class CreateProductDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @ApiProperty()
  @Type(() => Number)
  price: number;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  companyId: string;

  @IsArray()
  @ApiProperty()
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }): string[] => {
    if (typeof value === 'string') {
      return JSON.parse(value);
    }
    return value;
  })
  categories?: string[];

  @IsArray()
  @IsOptional()
  @ApiProperty({ type: [CertificationDto] })
  @Type(() => CertificationDto)
  @Transform(({ value }): CertificationDto[] => {
    if (value && Array.isArray(value)) {
      return value.map((v) =>
        typeof v === 'string'
          ? (JSON.parse(v) as CertificationDto)
          : (v as CertificationDto),
      );
    }
    if (typeof value === 'string') {
      return JSON.parse(value);
    }
    return value;
  })
  certifications?: CertificationDto[];
}
