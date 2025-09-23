import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/request/create-invoice.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRequest } from 'src/users/entities/UserRequest.dto';
import { InvoiceFilterDto } from './dto/request/invoice-filter.dto';

@Controller('invoices')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  create(
    @Body() createInvoiceDto: CreateInvoiceDto,
    @Req() req: Request & { user: UserRequest },
  ) {
    return this.invoicesService.create(createInvoiceDto, req.user);
  }

  @Get()
  findAll(@Query() filters: InvoiceFilterDto) {
    return this.invoicesService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoicesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.invoicesService.remove(id);
  }
}
