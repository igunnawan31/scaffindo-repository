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
  Patch,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/request/create-invoice.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRequest } from 'src/users/entities/UserRequest.dto';
import { InvoiceFilterDto } from './dto/request/invoice-filter.dto';
import { UpdateInvoiceDto } from './dto/request/update-invoice.dto';
import { Role, SubRole } from '@prisma/client';
import { SubRoles } from 'src/common/decorators/sub-roles.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('invoices')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @Roles(Role.FACTORY)
  @SubRoles(SubRole.ADMIN, SubRole.USER)
  create(
    @Body() createInvoiceDto: CreateInvoiceDto,
    @Req() req: Request & { user: UserRequest },
  ) {
    return this.invoicesService.create(createInvoiceDto, req.user);
  }

  @Get()
  findAll(
    @Query() filters: InvoiceFilterDto,
    @Req() req: Request & { user: UserRequest },
  ) {
    return this.invoicesService.findAll(filters, req.user);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() req: Request & { user: UserRequest },
  ) {
    return this.invoicesService.findOne(id, req.user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateInvoiceDto,
    @Req() req: Request & { user: UserRequest },
  ) {
    return this.invoicesService.update(id, dto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request & { user: UserRequest }) {
    return this.invoicesService.remove(id, req.user);
  }
}
