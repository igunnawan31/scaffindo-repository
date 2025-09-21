import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Role, SubRole } from '@prisma/client';

export class UserFilterDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  name?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  email?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  companyId?: string;

  @IsOptional()
  @IsEnum(Role)
  @ApiPropertyOptional()
  role?: Role;

  @IsOptional()
  @IsEnum(SubRole)
  @ApiPropertyOptional()
  subRole?: SubRole;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiPropertyOptional()
  page?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiPropertyOptional()
  limit?: number;
}
