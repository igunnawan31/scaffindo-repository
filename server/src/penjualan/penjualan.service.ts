import { Injectable, NotFoundException } from '@nestjs/common';
import { PenjualanFilterDto } from './dto/request/penjualan-filter.dto';
import {
  GetAllPenjualanResponseDto,
  GetPenjualanResponseDto,
} from './dto/response/read-response.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { handlePrismaError } from 'src/common/utils/prisma-exception.util';

@Injectable()
export class PenjualanService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(filters: PenjualanFilterDto = {} as PenjualanFilterDto): Promise<GetAllPenjualanResponseDto> {
    try {
      const {
        minCreatedDate,
        sortBy,
        sortOrder,
        page = 1,
        limit = 10,
      } = filters;
      const where: Prisma.PenjualanWhereInput = {};
      if (minCreatedDate) {
        where.createdAt = { gte: new Date(minCreatedDate) };
      }
      const orderBy: Prisma.PenjualanOrderByWithRelationInput = {};
      if (sortBy && ['createdAt', 'totalHarga'].includes(sortBy)) {
        orderBy[sortBy] = sortOrder === 'desc' ? 'desc' : 'asc';
      } else {
        orderBy.createdAt = 'asc';
      }

      const [penjualans, total] = await Promise.all([
        this.prisma.penjualan.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          include: { labels: { select: { id: true } } },
          orderBy,
        }),
        this.prisma.penjualan.count({ where }),
      ]);

      return plainToInstance(GetAllPenjualanResponseDto, {
        data: penjualans.map((p) =>
          plainToInstance(GetPenjualanResponseDto, {
            ...p,
            labelIds: p.labels.map((l) => l.id),
            labels: undefined,
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
      handlePrismaError(err, 'Penjualan');
    }
  }

  async findOne(id: string): Promise<GetPenjualanResponseDto> {
    try {
      const penjualan = await this.prisma.penjualan.findUnique({
        where: { id },
        include: { labels: { select: { id: true } } },
      });
      if (!penjualan)
        throw new NotFoundException(`Penjualan with ID ${id} not found`);
      return plainToInstance(GetPenjualanResponseDto, {
        ...penjualan,
        labelIds: penjualan.labels.map((l) => l.id),
        labels: undefined,
      });
    } catch (err) {
      handlePrismaError(err, 'Penjualan', id);
    }
  }
}
