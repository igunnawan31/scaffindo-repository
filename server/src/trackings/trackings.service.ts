import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { handlePrismaError } from 'src/common/utils/prisma-exception.util';
import { GetTrackingResponseDto } from './dto/response/read-response.dto';

@Injectable()
export class TrackingsService {
  constructor(private readonly prisma: PrismaService) {}
  // async findAll(filters: TrackingFilterDto): Promise<GetAllTrackingDto> {
  //   const {
  //     userId,
  //     status,
  //     companyType,
  //     searchTerm,
  //     minCreatedDate,
  //     labelId,
  //     companyId,
  //   } = filters;
  //
  //   const where: Prisma.TrackingWhereInput = {
  //     userId: userId ?? undefined,
  //     status: status ?? undefined,
  //     role: companyType ?? undefined,
  //     createdAt: minCreatedDate ? { gte: minCreatedDate } : undefined,
  //     labelId: labelId ?? undefined,
  //     companyId: companyId ?? undefined,
  //   };
  //
  //   // search term filter
  //   if (
  //     searchTerm !== undefined &&
  //     searchTerm !== null &&
  //     searchTerm.trim() !== ''
  //   ) {
  //     const searchValue = searchTerm.trim();
  //     where.OR = [
  //       {
  //         title: {
  //           contains: searchValue,
  //           mode: 'insensitive',
  //         },
  //       },
  //       {
  //         description: {
  //           contains: searchValue,
  //           mode: 'insensitive',
  //         },
  //       },
  //     ];
  //   }
  //   return `This action returns all trackings`;
  // }

  async getTrackLog(id: string): Promise<GetTrackingResponseDto[]> {
    try {
      const label = await this.prisma.label.findUnique({ where: { id } });
      if (!label) throw new NotFoundException(`Label with ID ${id} not found`);

      const trackings = await this.prisma.tracking.findMany({
        where: { Label: { id: label.id } },
      });

      return plainToInstance(GetTrackingResponseDto, trackings);
    } catch (err) {
      handlePrismaError(err, 'Tracking', id);
    }
  }
  // async getAllTrackLog(ids: string[]): Promise<GetTrackingResponseDto[]> {
  //   try {
  //     const label = await this.prisma.label.findUnique({ where: { id } });
  //     if (!label) throw new NotFoundException(`Label with ID ${id} not found`);
  //
  //     const trackings = await this.prisma.tracking.findMany({
  //       where: { Label: { id: label.id } },
  //     });
  //
  //     return plainToInstance(GetTrackingResponseDto, trackings);
  //   } catch (err) {
  //     handlePrismaError(err, 'Tracking', id);
  //   }
  // }
}
