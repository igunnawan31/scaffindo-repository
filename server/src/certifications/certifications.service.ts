import { Injectable } from '@nestjs/common';
import { CreateCertificationDto } from './dto/request/create-certification.dto';
import { UpdateCertificationDto } from './dto/request/update-certification.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { handlePrismaError } from 'src/common/utils/prisma-exception.util';

@Injectable()
export class CertificationsService {
  constructor(private readonly prisma: PrismaService) {}
  create(
    createCertificationDto: CreateCertificationDto,
    filesMeta: { certificationMeta: any[] },
  ) {
    try {
    } catch (err) {
      handlePrismaError(err, 'Certificate');
    }
    return 'This action adds a new certification';
  }

  findAll() {
    return `This action returns all certifications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} certification`;
  }

  update(id: number, updateCertificationDto: UpdateCertificationDto) {
    return `This action updates a #${id} certification`;
  }

  remove(id: number) {
    return `This action removes a #${id} certification`;
  }
}
