import { PartialType } from '@nestjs/mapped-types';
import { CreateUserResponseDto } from './create-response.dto';

export class UpdateUserResponseDto extends PartialType(CreateUserResponseDto) {}
