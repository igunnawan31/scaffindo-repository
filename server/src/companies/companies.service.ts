import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/request/create-company.dto';
import { UpdateCompanyDto } from './dto/request/update-company.dto';
import { CreateCompanyResponseDto } from './dto/response/create-response.dto';
import { handlePrismaError } from 'src/common/utils/prisma-exception.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { CompanyFilterDto } from './dto/request/company-filter.dto';
import {
  GetAllCompanyResponseDto,
  GetCompanyResponseDto,
} from './dto/response/read-response.dto';
import { Prisma } from '@prisma/client';
import { UpdateCompanyResponseDto } from './dto/response/update-response.dto';
import { DeleteCompanyResponseDto } from './dto/response/delete-response.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    createCompanyDto: CreateCompanyDto,
  ): Promise<CreateCompanyResponseDto> {
    const { name, companyType: type } = createCompanyDto;
    try {
      const company = await this.prisma.company.create({
        data: {
          name: name,
          type: type,
        },
      });

      return plainToInstance(CreateCompanyResponseDto, company);
    } catch (err) {
      handlePrismaError(err, 'Company');
    }
  }

  async findAll(filters: CompanyFilterDto): Promise<GetAllCompanyResponseDto> {
    const {
      searchTerm,
      page = 1,
      limit,
      sortBy,
      sortOrder,
      companyType,
    } = filters;
    try {
      const where: Prisma.CompanyWhereInput = {
        type: companyType ?? undefined,
      };

      // search term filter
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

      const orderBy: Prisma.CompanyOrderByWithRelationInput = {};
      if (sortBy && ['name'].includes(sortBy)) {
        orderBy[sortBy] = sortOrder === 'desc' ? 'desc' : 'asc';
      } else {
        orderBy.name = 'asc';
      }

      const [companies, total] = await Promise.all([
        this.prisma.company.findMany({
          where,
          skip: (page - 1) * (limit ?? 0),
          take: limit ?? undefined,
          orderBy,
        }),
        this.prisma.company.count({ where }),
      ]);
      return plainToInstance(GetAllCompanyResponseDto, {
        data: companies.map((c) =>
          plainToInstance(GetCompanyResponseDto, {
            ...c,
            companyType: c.type,
            type: undefined,
          }),
        ),
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / (limit ?? total)),
        },
      });
    } catch (err) {
      handlePrismaError(err, 'Company');
    }
  }

  async findOne(id: string): Promise<GetCompanyResponseDto> {
    try {
      const company = await this.prisma.company.findUnique({
        where: { id },
      });
      if (!company)
        throw new NotFoundException(`Company with ID ${id} not found`);
      return plainToInstance(GetCompanyResponseDto, company);
    } catch (err) {
      handlePrismaError(err, 'Company', id);
    }
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<UpdateCompanyResponseDto> {
    try {
      const { name, companyType } = updateCompanyDto;
      const existingCompany = await this.findOne(id);
      if (!existingCompany)
        throw new NotFoundException(`Company with ID ${id} not found`);
      const updateData: Prisma.CompanyUpdateInput = {
        name: name ?? undefined,
        type: companyType ?? undefined,
      };
      const query = await this.prisma.company.update({
        where: { id },
        data: updateData,
      });
      return plainToInstance(UpdateCompanyResponseDto, query);
    } catch (err) {
      handlePrismaError(err, 'Company', id);
    }
  }

  async remove(id: string): Promise<DeleteCompanyResponseDto> {
    try {
      const existingCompany = await this.findOne(id);
      if (!existingCompany)
        throw new NotFoundException(`Company with ID ${id} not found`);

      await this.prisma.user.deleteMany({
        where: { companyId: id },
      });

      const query = await this.prisma.company.delete({
        where: { id },
      });
      return plainToInstance(DeleteCompanyResponseDto, query);
    } catch (err) {
      handlePrismaError(err, 'Company', id);
    }
  }
}
