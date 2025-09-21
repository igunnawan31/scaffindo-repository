import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role, SubRole } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  companyId: string;

  @IsNotEmpty()
  @IsEnum(Role)
  @ApiProperty()
  role: Role;

  @IsNotEmpty()
  @IsEnum(SubRole)
  @ApiProperty()
  subRole: SubRole;
}
