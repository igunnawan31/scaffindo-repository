import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CompanyFilterDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  searchTerm?: string;
}
