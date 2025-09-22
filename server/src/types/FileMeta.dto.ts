import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';
import { FileMetaDataInterface } from './FileMetaData.interface';

export class FileMetaData {
  @IsString()
  filename: string;

  @IsString()
  path: string;

  @IsString()
  mimetype: string;

  @IsInt()
  @Type(() => Number)
  size: number;
}

export class FileMetaDataResponse {
  @Expose()
  @ApiResponseProperty()
  filename: string;

  @Expose()
  @ApiResponseProperty()
  path: string;

  @Expose()
  @ApiResponseProperty()
  mimetype: string;

  @Expose()
  @ApiResponseProperty()
  size: number;
}


// export function isFileMetaData(obj: FileMetaData)is FileMetaDataInterface {
//   return (
//     obj != null &&
//     typeof obj === 'object' &&
//     typeof obj.filename === 'string' &&
//     typeof obj.path === 'string' &&
//     typeof obj.mimetype === 'string' &&
//     typeof obj.size === 'number'
//   );
// }
