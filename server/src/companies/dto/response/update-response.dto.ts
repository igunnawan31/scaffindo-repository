import { PartialType } from '@nestjs/swagger';
import { CreateCompanyResponseDto } from './create-response.dto';

export class UpdateCompanyResponseDto extends PartialType(
  CreateCompanyResponseDto,
) {}
