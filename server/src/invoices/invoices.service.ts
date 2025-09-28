import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateInvoiceDto } from './dto/request/create-invoice.dto';
import { UserRequest } from 'src/users/entities/UserRequest.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CompanyType,
  LabelStatus,
  Prisma,
  Role,
  TrackStatus,
} from '@prisma/client'; // Make sure to import enums from Prisma
import { CreateInvoiceResponseDto } from './dto/response/create-response.dto';
import { handlePrismaError } from 'src/common/utils/prisma-exception.util';
import { plainToInstance } from 'class-transformer';
import { InvoiceFilterDto } from './dto/request/invoice-filter.dto';
import { UpdateInvoiceDto } from './dto/request/update-invoice.dto';
import {
  GetAllInvoiceResponseDto,
  GetInvoiceResponseDto,
} from './dto/response/read-response.dto';
import { DeleteInvoiceResponseDto } from './dto/response/delete-response.dto';

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}
  create(
    createInvoiceDto: CreateInvoiceDto,
    user: UserRequest,
  ): Promise<CreateInvoiceResponseDto> {
    try {
      const { totalLabel, productId, title, description } = createInvoiceDto;
      const { id: userId } = user;

      if (totalLabel <= 0) {
        throw new BadRequestException('totalLabel must be at least 1');
      }

      // if (!Array.isArray(PICIds) || PICIds.length === 0) {
      //   throw new BadRequestException(
      //     'At least one PIC (Person in Charge) is required',
      //   );
      // }

      const query = this.prisma.$transaction(async (tx) => {
        // 1. Fetch product with company
        const product = await tx.product.findUnique({
          where: { id: productId },
        });

        if (!product) {
          throw new BadRequestException(
            `Product with id ${productId} not found`,
          );
        }

        if (
          user.companyId !== product.companyId &&
          user.role !== Role.SUPERADMIN
        ) {
          throw new UnauthorizedException(
            `User is not permitted to create invoices of other companies.`,
          );
        }

        // 2. Sanitize product name for use in label ID
        const cleanProductName = product.name
          .replace(/[^a-zA-Z0-9\s]/g, '') // remove special chars
          .replace(/\s+/g, '-') // spaces → single hyphen
          .replace(/-+/g, '-')
          .trim();

        // 3. Count existing invoices for this product → generate invoice ID
        const invoiceCount = await tx.invoice.count({
          where: { productId },
        });
        const globalCount = await tx.invoice.count();
        const invoiceNumber = invoiceCount + 1; // PRODUCT BATCH
        const invoiceGlobalNum = globalCount + 1; // INVOICE GLOBAL COUNT
        const invoiceId = `INVOICE-${invoiceGlobalNum}-${cleanProductName}-${String(invoiceNumber).padStart(3, '0')}`; // e.g., INVOICE-001
        const defStatus = LabelStatus.FACTORY_DONE;

        if (!cleanProductName) {
          throw new BadRequestException(
            'Product name must contain valid characters for label generation',
          );
        }

        // 5. Create Invoice
        const invoice = await tx.invoice.create({
          data: {
            id: invoiceId,
            productId: productId,
            status: defStatus,
            qrCode: {}, // placeholder doang
            companyId: user.companyId,
            nextCompanyId: createInvoiceDto.nextCompanyId,
          },
        });

        // 6. Create Labels (totalLabel times)
        for (let i = 1; i <= totalLabel; i++) {
          const seq = String(i).padStart(4, '0'); // 0001, 0002, ...
          const labelId = `${invoiceId}-${seq}`;

          await tx.label.create({
            data: {
              id: labelId,
              qrCode: {}, // placeholder doang
              status: defStatus,
              productId: productId,
              invoiceId: invoiceId,
            },
          });

          await tx.tracking.create({
            data: {
              userId: user.id,
              companyType: CompanyType.FACTORY,
              title: title,
              description: description,
              status: TrackStatus.FACTORY_DONE,
              labelId: labelId,
              companyId: user.companyId,
            },
          });
        }

        // 7. Create InvoicePIC relationships
        // await Promise.all(
        //   PICIds.map((userId) =>
        //     tx.invoicePIC.create({
        //       data: {
        //         userId,
        //         invoiceId,
        //       },
        //     }),
        //   ),
        // );
        await tx.invoicePIC.create({
          data: {
            userId,
            invoiceId,
          },
        });

        const result = await tx.invoice.findUnique({
          where: { id: invoice.id },
          include: {
            labels: { select: { id: true } },
            PICs: { select: { userId: true } },
          },
        });

        return plainToInstance(CreateInvoiceResponseDto, {
          ...result,
          labelIds: result?.labels.map((l) => l.id),
          PICIds: result?.PICs.map((p) => p.userId),
          labels: undefined,
          PICs: undefined,
        });
      });

      return query;
    } catch (err) {
      handlePrismaError(err, 'Invoice');
    }
  }

  async findAll(
    filters: InvoiceFilterDto,
    user: UserRequest,
  ): Promise<GetAllInvoiceResponseDto> {
    try {
      const { productId, page = 1, limit = 10, sortBy, sortOrder } = filters;
      const where: Prisma.InvoiceWhereInput = {
        productId: productId ?? undefined,
        // Product: {
        //   companyId:
        //     user.role === Role.SUPERADMIN
        //       ? undefined
        //       : user.role === Role.DISTRIBUTOR
        //         ? undefined
        //         : user.role === Role.AGENT
        //           ? undefined
        //           : user.role === Role.RETAIL
        //             ? undefined
        //             : user.companyId,
        // },
      };
      const orderBy: Prisma.InvoiceOrderByWithRelationInput = {};
      if (sortBy && ['productId'].includes(sortBy)) {
        orderBy[sortBy] = sortOrder === 'desc' ? 'desc' : 'asc';
      } else {
        orderBy.productId = 'asc';
      }

      const [invoices, total] = await Promise.all([
        this.prisma.invoice.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          include: {
            labels: { select: { id: true } },
            PICs: { select: { userId: true } },
          },
          orderBy,
        }),
        this.prisma.invoice.count({ where }),
      ]);
      return plainToInstance(GetAllInvoiceResponseDto, {
        data: invoices.map((i) =>
          plainToInstance(GetInvoiceResponseDto, {
            ...i,
            labelIds: i.labels.map((l) => l.id),
            labels: undefined,
            PICIds: i.PICs.map((p) => p.userId),
            PICs: undefined,
          }),
        ),
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      handlePrismaError(err, 'Invoice');
    }
  }

  async findOne(id: string, user: UserRequest): Promise<GetInvoiceResponseDto> {
    try {
      const invoice = await this.prisma.invoice.findUnique({
        where: { id },
        include: {
          labels: { select: { id: true } },
          PICs: { include: { User: { select: { companyId: true } } } },
        },
      });

      if (!invoice)
        throw new NotFoundException(`Invoice with ID ${id} not found`);
      // console.log(invoice.PICs.map((pic) => pic.User.companyId));

      return plainToInstance(GetInvoiceResponseDto, {
        ...invoice,
        labelIds: invoice.labels.map((l) => l.id),
        PICIds: invoice.PICs.map((p) => p.userId),
        PICs: undefined,
        labels: undefined,
        Product: undefined,
      });
    } catch (err) {
      handlePrismaError(err, 'Invoice', id);
    }
  }

  async update(
    id: string,
    updateInvoiceDto: UpdateInvoiceDto,
    user: UserRequest,
  ): Promise<UpdateInvoiceDto> {
    try {
      const invoice = await this.findOne(id, user);

      if (!invoice)
        throw new NotFoundException(`Invoice with ID ${id} not found`);

      // const userData = await this.prisma.user.findUnique({
      //   where: { id: userId },
      // });
      // if (!userData)
      //   throw new NotFoundException(`User with ID ${userId} not found`);
      const product = await this.prisma.product.findUnique({
        where: { id: invoice.productId },
      });
      // if (
      //   user.companyId !== product?.companyId &&
      //   user.companyId !== invoice.nextCompanyId
      // ) {
      //   throw new UnauthorizedException(
      //     `User is not permitted to update other company's invoice`,
      //   );
      // }
      const companyData = await this.prisma.company.findUnique({
        where: { id: user.companyId },
      });
      if (!companyData)
        throw new NotFoundException(
          `Company with ID ${user.companyId} not found`,
        );

      // Prevent updating to PURCHASED_BY_CUSTOMER
      if (updateInvoiceDto.status === LabelStatus.PURCHASED_BY_CUSTOMER) {
        throw new UnauthorizedException(`Updating to this status is forbidden`);
      }

      // 1. Validate role + status permission
      if (
        (updateInvoiceDto.status === LabelStatus.DISTRIBUTOR_ACCEPTED &&
          user.role !== Role.DISTRIBUTOR) ||
        (updateInvoiceDto.status === LabelStatus.AGENT_ACCEPTED &&
          user.role !== Role.AGENT) ||
        (updateInvoiceDto.status === LabelStatus.RETAIL_ACCEPTED &&
          user.role !== Role.RETAIL)
      ) {
        throw new UnauthorizedException(
          `${user.role} is forbidden to update status to ${updateInvoiceDto.status}`,
        );
      }

      // 2. Only create tracking for these 3 statuses (and we know they're valid now)
      let status: TrackStatus | undefined;
      if (
        updateInvoiceDto.status === LabelStatus.DISTRIBUTOR_ACCEPTED ||
        updateInvoiceDto.status === LabelStatus.AGENT_ACCEPTED ||
        updateInvoiceDto.status === LabelStatus.RETAIL_ACCEPTED
      ) {
        // Safe cast: these values exist in both enums with same name
        status = updateInvoiceDto.status as TrackStatus;
      }
      const updated = await this.prisma.$transaction(async (tx) => {
        const updateQuery = await tx.invoice.update({
          where: { id },
          data: {
            status: updateInvoiceDto.status,
            companyId: user.companyId,
            nextCompanyId: updateInvoiceDto.nextCompanyId,
          },
        });

        await Promise.all(
          invoice.labelIds.map(async (label) =>
            tx.label.update({
              where: { id: label },
              data: { status: updateInvoiceDto.status },
            }),
          ),
        );

        if (status) {
          if (!updateInvoiceDto.title || !updateInvoiceDto.description) {
            throw new BadRequestException(
              `Title and description are required to update to ${updateInvoiceDto.status}`,
            );
          }

          await Promise.all(
            invoice.labelIds.map(async (label) =>
              tx.tracking.create({
                data: {
                  userId: user.id,
                  companyType: companyData.type,
                  title: updateInvoiceDto.title,
                  description: updateInvoiceDto.description,
                  status,
                  labelId: label,
                  companyId: user.companyId,
                },
              }),
            ),
          );
        }

        return updateQuery;
      });
      return plainToInstance(UpdateInvoiceDto, updated);
    } catch (err) {
      handlePrismaError(err, 'Invoice', id);
    }
  }

  async remove(
    id: string,
    user: UserRequest,
  ): Promise<DeleteInvoiceResponseDto> {
    try {
      const existingInvoice = await this.findOne(id, user);
      if (!existingInvoice)
        throw new NotFoundException(`Invoice with ID ${id} not found`);
      const product = await this.prisma.product.findUnique({
        where: { id: existingInvoice.productId },
      });
      if (user.companyId !== product?.companyId) {
        throw new UnauthorizedException(
          `User is not permitted to delete other company's invoice`,
        );
      }
      const query = await this.prisma.invoice.delete({ where: { id } });
      return plainToInstance(DeleteInvoiceResponseDto, query);
    } catch (err) {
      handlePrismaError(err, 'Invoice', id);
    }
  }
}
