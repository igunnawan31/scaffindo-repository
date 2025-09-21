import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  price: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @Transform(({ value }): string[] => {
    if (typeof value === 'string') {
      return JSON.parse(value);
    }
    return value;
  })
  categories: string[];

  // @IsArray()
  // @Type(() => CertificationDTO)
  // @Transform(({ value }): CertificationDTO[] => {
  //   if (value && Array.isArray(value)) {
  //     return value.map((v) =>
  //       typeof v === 'string' ? (JSON.parse(v) as CertificationDTO) : (v as CertificationDTO),
  //     );
  //   }
  //   if (typeof value === 'string') {
  //     return JSON.parse(value);
  //   }
  //   return value;
  // })
  // certifications: CertificationDTO[]
}
