import { Module } from '@nestjs/common';
import { PenjualanService } from './penjualan.service';
import { PenjualanController } from './penjualan.controller';

@Module({
  controllers: [PenjualanController],
  providers: [PenjualanService],
})
export class PenjualanModule {}
