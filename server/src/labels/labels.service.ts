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
      const updated = await this.prisma.$transaction(async (tx) => {
        const updateData: Prisma.LabelUpdateInput = {
          status: dto.status,
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
      // 1. Validate role + status permission
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

      // 2. Only create tracking for these 3 statuses (and we know they're valid now)
      let status: TrackStatus | undefined;
      if (
        updateLabelDto.status === LabelStatus.DISTRIBUTOR_ACCEPTED ||
        updateLabelDto.status === LabelStatus.AGENT_ACCEPTED ||
        updateLabelDto.status === LabelStatus.RETAIL_ACCEPTED
      ) {
        // Safe cast: these values exist in both enums with same name
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
      if (
        label.currentCompanyId !== user.companyId ||
        label.nextCompanyId !== user.companyId
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
