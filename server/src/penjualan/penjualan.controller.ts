import { Controller, Get, Param } from '@nestjs/common';
import { PenjualanService } from './penjualan.service';
import { PenjualanFilterDto } from './dto/request/penjualan-filter.dto';

@Controller('penjualan')
export class PenjualanController {
  constructor(private readonly penjualanService: PenjualanService) {}
  @Get()
  findAll(filters: PenjualanFilterDto) {
    return this.penjualanService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.penjualanService.findOne(id);
  }
}
