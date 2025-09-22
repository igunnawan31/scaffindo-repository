import { PartialType } from '@nestjs/swagger';
import { CreateCertificationResponseDto } from './create-response.dto';

export class UpdateCertificationResponseDto extends PartialType(
  CreateCertificationResponseDto,
) {}
