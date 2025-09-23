import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/request/create-invoice.dto';
import { UserRequest } from 'src/users/entities/UserRequest.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsService } from 'src/products/products.service';
import { UpdateInvoiceDto } from './dto/request/update-invoice.dto';
import { InvoiceFilterDto } from './dto/request/invoice-filter.dto';

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createInvoiceDto: CreateInvoiceDto, user: UserRequest) {
    const { PICIds, totalLabel, productId } = createInvoiceDto;
    const totalInvoice = await this.prisma.invoice.count({
      where: { productId },
    });
    // const invoiceId = `INVOICE-${productData.name}-${totalInvoice + 1}`;
  }

  findAll(filters: InvoiceFilterDto) {
    return `This action returns all invoices`;
  }

  findOne(id: string) {
    return `This action returns a #${id} invoice`;
  }

  receive(id: string, updateInvoiceDto: UpdateInvoiceDto) {
    return `This action updates a #${id} invoice`;
  }

  remove(id: string) {
    return `This action removes a #${id} invoice`;
  }
}
