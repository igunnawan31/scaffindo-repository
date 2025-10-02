import { Body, Controller, Get, Param } from '@nestjs/common';
import { TrackingsService } from './trackings.service';

@Controller('trackings')
export class TrackingsController {
  constructor(private readonly trackingsService: TrackingsService) {}

  // @Get('/many')
  // findMany(@Body() ids: string[]) {
  //   return this.trackingsService.getAllTrackLog(ids);
  // }

  @Get(':id') // id label yah ganteng
  findOne(@Param('id') id: string) {
    return this.trackingsService.getTrackLog(id);
  }
}
