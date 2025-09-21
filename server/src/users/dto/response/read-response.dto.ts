import { Expose } from 'class-transformer';
import { CreateUserResponseDto } from './create-response.dto';
import { meta } from 'src/types/meta.dto';
import { ApiResponseProperty } from '@nestjs/swagger';

export class GetUserResponseDto extends CreateUserResponseDto {}

export class GetAllUserResponseDto {
  @ApiResponseProperty({
    type: [GetUserResponseDto],
  })
  @Expose()
  data: GetUserResponseDto[];

  @ApiResponseProperty({
    type: meta,
  })
  @Expose()
  meta: meta;
}
