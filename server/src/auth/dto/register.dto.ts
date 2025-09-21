import { ApiProperty } from '@nestjs/swagger';
import { Role, SubRole } from '@prisma/client';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty()
  password: string;

  @IsEnum(Role)
  @ApiProperty()
  role: Role;

  @IsEnum(SubRole)
  @ApiProperty()
  subRole: SubRole;

  @IsString()
  @ApiProperty()
  companyId: string;
}
