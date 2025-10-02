import { Controller, Get, Param, Query } from '@nestjs/common';
import { PenjualanService } from './penjualan.service';
import { PenjualanFilterDto } from './dto/request/penjualan-filter.dto';

@Controller('penjualan')
export class PenjualanController {
  constructor(private readonly penjualanService: PenjualanService) {}
  @Get()
  findAll(@Query() filters: PenjualanFilterDto) {
    return this.penjualanService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.penjualanService.findOne(id);
  }
}
