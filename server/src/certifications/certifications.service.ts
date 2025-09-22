import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCertificationDto } from './dto/request/create-certification.dto';
import { UpdateCertificationDto } from './dto/request/update-certification.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { handlePrismaError } from 'src/common/utils/prisma-exception.util';
import { plainToInstance } from 'class-transformer';
import { CreateCertificationResponseDto } from './dto/response/create-response.dto';
import {
  GetAllCertificationResponseDto,
  GetCertificationResponseDto,
} from './dto/response/read-response.dto';
import { CertificationFilterDto } from './dto/request/certification-filter.dto';
import { Prisma } from '@prisma/client';
import { meta } from 'src/types/meta.dto';
import { UpdateCertificationResponseDto } from './dto/response/update-response.dto';
import { deleteFileArray } from 'src/utils/fileHelper';
import { DeleteCertificationResponseDto } from './dto/response/delete-response.dto';

@Injectable()
export class CertificationsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    createCertificationDto: CreateCertificationDto,
    filesMeta: { certificateMeta: any[] },
  ): Promise<CreateCertificationResponseDto> {
    const { certificateMeta } = filesMeta;
    const { name, expired, details, productId } = createCertificationDto;
    try {
      const certificate = await this.prisma.certification.create({
        data: {
          name: name,
          expired: new Date(expired),
          details: details,
          productId: productId,
          document: certificateMeta,
        },
      });

      return plainToInstance(CreateCertificationResponseDto, certificate);
    } catch (err) {
      handlePrismaError(err, 'Certificate');
    }
  }

  async findAll(
    filters: CertificationFilterDto,
  ): Promise<GetAllCertificationResponseDto> {
    const {
      searchTerm,
      expired,
      productId,
      page = 1,
      limit = 10,
      sortBy,
      sortOrder,
    } = filters;
    try {
      const where: Prisma.CertificationWhereInput = {};
      // Category filter
      if (expired !== undefined && expired !== null) {
        where.expired = { gte: new Date(expired) };
      }

      // Search term filter
      if (
        searchTerm !== undefined &&
        searchTerm !== null &&
        searchTerm.trim() !== ''
      ) {
        const searchValue = searchTerm.trim();
        where.OR = [
          {
            name: {
              contains: searchValue,
              mode: 'insensitive',
            },
          },
          {
            id: {
              contains: searchValue,
              mode: 'insensitive',
            },
          },
        ];
      }
      // ProductId filter
      if (productId !== undefined && productId !== null) {
        where.productId = productId;
      }

      const orderBy: Prisma.ProductOrderByWithRelationInput = {};
      if (
        sortBy &&
        ['name', 'productId', 'price', 'companyId'].includes(sortBy)
      ) {
        orderBy[sortBy] = sortOrder === 'desc' ? 'desc' : 'asc';
      } else {
        orderBy.name = 'asc';
      }
      const [certificates, total] = await Promise.all([
        this.prisma.certification.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy,
        }),
        this.prisma.certification.count({ where }),
      ]);
      const meta: meta = {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      };

      return plainToInstance(GetAllCertificationResponseDto, {
        data: certificates.map((p) =>
          plainToInstance(GetCertificationResponseDto, p),
        ),
        meta,
      });
    } catch (err) {
      handlePrismaError(err, 'Certification');
    }
  }

  async findOne(id: string): Promise<GetCertificationResponseDto> {
    try {
      const certificate = await this.prisma.certification.findUnique({
        where: { id },
      });
      if (!certificate) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      return plainToInstance(GetCertificationResponseDto, certificate);
    } catch (err) {
      handlePrismaError(err, 'Certification', id);
    }
  }

  async update(
    id: string,
    updateCertificationDto: UpdateCertificationDto,
    filesMeta?: { certificateMeta: any[] },
  ): Promise<UpdateCertificationResponseDto> {
    try {
      const { name, expired, details } = updateCertificationDto;
      const existingCert = await this.findOne(id);
      if (!existingCert) {
        throw new NotFoundException(`Certification with ID ${id} not found`);
      }

      if (
        filesMeta &&
        filesMeta.certificateMeta &&
        filesMeta.certificateMeta.length > 0
      ) {
        await Promise.all(
          existingCert.document.map(async (cert) => {
            if (cert) {
              await deleteFileArray([cert], 'certificationDoc');
            }
          }),
        );
      }

      const updateData: Prisma.CertificationUpdateInput = {
        name: name ?? undefined,
        details: details ?? undefined,
        expired: expired ? new Date(expired) : undefined,
        document:
          filesMeta &&
          filesMeta.certificateMeta &&
          filesMeta.certificateMeta.length > 0
            ? filesMeta.certificateMeta
            : undefined,
      };

      const update = await this.prisma.certification.update({
        where: { id },
        data: updateData,
      });
      return plainToInstance(UpdateCertificationResponseDto, update);
    } catch (err) {
      handlePrismaError(err, 'Certification', id);
    }
  }

  async remove(id: string): Promise<DeleteCertificationResponseDto> {
    try {
      const certificate = await this.findOne(id);
      if (!certificate)
        throw new NotFoundException(`Certificate ${id} not found`);
      await Promise.all([
        deleteFileArray(certificate.document, 'certificateDoc'),
      ]);
      const query = await this.prisma.certification.delete({
        where: { id },
      });
      return plainToInstance(DeleteCertificationResponseDto, query);
    } catch (err) {
      handlePrismaError(err, 'Certification', id);
    }
  }
}
