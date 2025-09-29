import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LabelFilterDto } from './dto/request/label-filter.dto';
import { handlePrismaError } from 'src/common/utils/prisma-exception.util';
import {
  CompanyType,
  LabelStatus,
  Prisma,
  Role,
  TrackStatus,
} from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import {
  GetAllLabelResponseDto,
  GetLabelResponseDto,
} from './dto/response/read-response.dto';
import { UpdateLabelDto } from './dto/request/update-label.dto';
import { UpdateLabelResponseDto } from './dto/response/update-response.dto';
import { DeleteLabelResponseDto } from './dto/response/delete-response.dto';
import { UserRequest } from 'src/users/entities/UserRequest.dto';
import { BuyDto } from './dto/request/buy.dto';
import { BulkBuyDto } from './dto/request/bulkBuy.dto';

@Injectable()
export class LabelsService {
  constructor(private readonly prisma: PrismaService) {}
  // create(createLabelDto: CreateLabelDto) {
  //   return 'This action adds a new label';
  // }

  async findAll(filters: LabelFilterDto): Promise<GetAllLabelResponseDto> {
    try {
      const {
        status,
        productId,
        penjualanId,
        invoiceId,
        minCreatedDate,
        minUpdatedDate,
        page = 1,
        limit = 10,
        sortBy,
        sortOrder,
      } = filters;

      const where: Prisma.LabelWhereInput = {
        status: status ?? undefined,
        productId: productId ?? undefined,
        penjualanId: penjualanId ?? undefined,
        invoiceId: invoiceId ?? undefined,
        createdAt: minCreatedDate ?? undefined,
        updatedAt: minUpdatedDate ?? undefined,
      };
      const orderBy: Prisma.LabelOrderByWithRelationInput = {};
      if (sortBy && ['status', 'createdAt', 'updatedAt'].includes(sortBy)) {
        orderBy[sortBy] = sortOrder === 'desc' ? 'desc' : 'asc';
      } else {
        orderBy.createdAt = 'asc';
      }
      const [labels, total] = await Promise.all([
        this.prisma.label.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          include: {
            // Product: { select: { id: true } },
            // Penjualan: { select: { id: true } },
            // Invoice: { select: { id: true } },
            trackings: { select: { id: true } },
          },
          orderBy,
        }),
        this.prisma.label.count({ where }),
      ]);
      return plainToInstance(GetAllLabelResponseDto, {
        data: labels.map((l) =>
          plainToInstance(GetLabelResponseDto, {
            ...l,
            trackings: l.trackings.map((t) => t.id),
          }),
        ),
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      handlePrismaError(err, 'Label');
    }
  }

  async findOne(id: string): Promise<GetLabelResponseDto> {
    try {
      const label = await this.prisma.label.findUnique({
        where: { id },
        include: {
          // Product: true,
          // Penjualan: true,
          // Invoice: true,
          trackings: { select: { id: true } },
        },
      });
      if (!label) throw new NotFoundException(`Label with ID ${id} not found`);
      return plainToInstance(GetLabelResponseDto, {
        ...label,
        trackings: label.trackings.map((t) => t.id),
      });
    } catch (err) {
      handlePrismaError(err, 'Label', id);
    }
  }

  async bulkBuy(
    dto: BulkBuyDto,
    user: UserRequest,
  ): Promise<UpdateLabelResponseDto[]> {
    const { labelIds, title, description, paymentMethod } = dto;

    if (!labelIds || labelIds.length === 0) {
      throw new BadRequestException('At least one label ID is required');
    }

    return this.prisma.$transaction(async (tx) => {
      const labels = await tx.label.findMany({
        where: { id: { in: labelIds } },
        include: { Product: true },
      });

      if (labels.length !== labelIds.length) {
        const foundIds = new Set(labels.map((l) => l.id));
        const missing = labelIds.filter((id) => !foundIds.has(id));
        throw new NotFoundException(`Labels not found: ${missing.join(', ')}`);
      }

      for (const label of labels) {
        if (label.status !== LabelStatus.ARRIVED_AT_RETAIL) {
          throw new BadRequestException(
            `Label ${label.id} is not ready for purchase`,
          );
        }
      }

      const totalHarga = labels.reduce(
        (sum, label) => sum + label.Product.price,
        0,
      );

      const penjualan = await tx.penjualan.create({
        data: {
          totalHarga,
          paymentMethod,
        },
      });

      const results: UpdateLabelResponseDto[] = [];

      for (const label of labels) {
        const updatedLabel = await tx.label.update({
          where: { id: label.id },
          data: {
            status: LabelStatus.PURCHASED_BY_CUSTOMER,
            penjualanId: penjualan.id,
          },
          include: {
            Product: true,
            trackings: { select: { id: true } },
          },
        });

        await tx.tracking.create({
          data: {
            userId: user.id,
            companyType: CompanyType.CONSUMER,
            title,
            description,
            status: TrackStatus.PURCHASED_BY_CUSTOMER,
            labelId: label.id,
            companyId: user.companyId,
          },
        });

        results.push(
          plainToInstance(UpdateLabelResponseDto, {
            ...updatedLabel,
            productId: updatedLabel.productId,
            invoiceId: updatedLabel.invoiceId,
            penjualanId: updatedLabel.penjualanId,
            trackings: updatedLabel.trackings.map((t) => t.id),
          }),
        );
      }

      return results;
    });
  }

  async buy(
    id: string,
    dto: BuyDto,
    user: UserRequest,
  ): Promise<UpdateLabelResponseDto> {
    try {
      const label = await this.findOne(id);
      if (!label) throw new NotFoundException(`Label with ID ${id} not found`);
      if (dto.status !== LabelStatus.PURCHASED_BY_CUSTOMER) {
        throw new BadRequestException(
          `This status is not meant to be sent through this API. Use '/:id' instead`,
        );
      }
      if (label.status !== LabelStatus.ARRIVED_AT_RETAIL) {
        throw new BadRequestException(
          `Label ${label.id} is not ready for purchase`,
        );
      }
      const updated = await this.prisma.$transaction(async (tx) => {
        const updateData: Prisma.LabelUpdateInput = {
          status: dto.status,
        };
        const update = await tx.label.update({
          where: { id },
          data: updateData,
          include: {
            Product: true,
            // Penjualan: { select: { id: true } },
            // Invoice: { select: { id: true } },
            trackings: { select: { id: true } },
          },
        });
        const penjualan = await tx.penjualan.create({
          data: {
            totalHarga: update.Product.price,
            paymentMethod: dto.paymentMethod,
          },
        });
        await tx.label.update({
          where: { id },
          data: {
            penjualanId: penjualan.id,
          },
        });
        await tx.tracking.create({
          data: {
            userId: user.id,
            companyType: 'CONSUMER',
            title: dto.title,
            description: dto.description,
            status: LabelStatus.PURCHASED_BY_CUSTOMER,
            labelId: id,
            companyId: user.companyId,
          },
        });
        return update;
      });
      return plainToInstance(UpdateLabelResponseDto, {
        ...updated,
        productId: updated.productId,
        invoiceId: updated.invoiceId,
        penjualanId: updated.penjualanId,
        trackings: updated.trackings.map((t) => t.id),
      });
    } catch (err) {
      handlePrismaError(err, 'Label', id);
    }
  }

  async update(
    id: string,
    updateLabelDto: UpdateLabelDto,
    user: UserRequest,
  ): Promise<UpdateLabelResponseDto> {
    try {
      const label = await this.findOne(id);
      if (!label) throw new NotFoundException(`Label with ID ${id} not found`);
      if (
        updateLabelDto.status === LabelStatus.FACTORY_DONE ||
        updateLabelDto.status === LabelStatus.PURCHASED_BY_CUSTOMER
      ) {
        throw new BadRequestException(
          `This status is not meant to be sent through this API.`,
        );
      }
      const userData = await this.prisma.user.findUnique({
        where: { id },
        select: { companyId: true },
      });
      if (
        (updateLabelDto.status === LabelStatus.DISTRIBUTOR_ACCEPTED &&
          user.role !== Role.DISTRIBUTOR) ||
        (updateLabelDto.status === LabelStatus.AGENT_ACCEPTED &&
          user.role !== Role.AGENT) ||
        (updateLabelDto.status === LabelStatus.RETAIL_ACCEPTED &&
          user.role !== Role.RETAIL)
      ) {
        throw new UnauthorizedException(
          `${user.role} is forbidden to update status to ${updateLabelDto.status}`,
        );
      }

      let status: TrackStatus | undefined;
      if (
        updateLabelDto.status === LabelStatus.DISTRIBUTOR_ACCEPTED ||
        updateLabelDto.status === LabelStatus.AGENT_ACCEPTED ||
        updateLabelDto.status === LabelStatus.RETAIL_ACCEPTED
      ) {
        status = updateLabelDto.status as TrackStatus;
      }
      const updated = await this.prisma.$transaction(async (tx) => {
        const updateData: Prisma.LabelUpdateInput = {
          status: updateLabelDto.status,
        };
        const update = await tx.label.update({
          where: { id },
          data: updateData,
          include: {
            // Product: { select: { id: true } },
            // Penjualan: { select: { id: true } },
            // Invoice: { select: { id: true } },
            trackings: { select: { id: true } },
          },
        });
        if (status) {
          let type: CompanyType;
          if (user.role === Role.SUPERADMIN || user.role === Role.CONSUMER) {
            throw new BadRequestException(
              `${user.role} doesn't have companyId therefore cannot update invoice to ${updateLabelDto.status}`,
            );
          } else {
            if (user.role === Role.DISTRIBUTOR) {
              type = CompanyType.DISTRIBUTOR;
            } else if (user.role === Role.AGENT) {
              type = CompanyType.AGENT;
            } else {
              type = CompanyType.RETAIL;
            }
          }
          await tx.tracking.create({
            data: {
              userId: user.id,
              companyType: type,
              title: updateLabelDto.title,
              description: updateLabelDto.description,
              status,
              labelId: id,
              companyId: userData!.companyId!,
            },
          });
        }
        return update;
      });
      return plainToInstance(UpdateLabelResponseDto, {
        ...updated,
        productId: updated.productId,
        invoiceId: updated.invoiceId,
        penjualanId: updated.penjualanId,
        trackings: updated.trackings.map((t) => t.id),
      });
    } catch (err) {
      handlePrismaError(err, 'Label', id);
    }
  }

  async remove(id: string, user: UserRequest): Promise<DeleteLabelResponseDto> {
    try {
      const label = await this.findOne(id);
      if (!label) throw new NotFoundException(`Label with ID ${id} not found`);
      const invoice = await this.prisma.invoice.findUnique({
        where: { id: label.invoiceId },
      });
      if (!invoice)
        throw new NotFoundException(`Label with ID ${id} not found`);
      if (
        invoice.companyId !== user.companyId ||
        invoice.nextCompanyId !== user.companyId
      )
        throw new UnauthorizedException(
          `Removing other company's label is forbidden`,
        );
      const deleteQuery = await this.prisma.label.delete({
        where: { id },
        include: {
          // Product: { select: { id: true } },
          // Penjualan: { select: { id: true } },
          // Invoice: { select: { id: true } },
          trackings: { select: { id: true } },
        },
      });
      return plainToInstance(DeleteLabelResponseDto, {
        ...deleteQuery,
        trackings: deleteQuery.trackings.map((t) => t.id),
      });
    } catch (err) {
      handlePrismaError(err, 'Label', id);
    }
  }
}
