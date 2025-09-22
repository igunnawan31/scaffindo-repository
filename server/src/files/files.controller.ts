import { Controller, Get, NotFoundException, Query, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import type { Response } from 'express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  async getFile(
    @Query('path') filePath: string,
    @Res() res: Response,
  ): Promise<void> {
    const fullPath = await this.filesService.getFileByPath(filePath);
    if (!fullPath) throw new NotFoundException('File not found');

    res.sendFile(fullPath);
  }
}
