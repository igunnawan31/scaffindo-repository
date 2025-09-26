import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CompanyType } from '@prisma/client';

export class CreateCompanyDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @IsEnum(CompanyType)
  @ApiProperty()
  companyType: CompanyType;
}
