import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { CertificationsService } from './certifications.service';
import { CreateCertificationDto } from './dto/request/create-certification.dto';
import { UpdateCertificationDto } from './dto/request/update-certification.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CertificationFilterDto } from './dto/request/certification-filter.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { extname } from 'path';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateCertificationResponseDto } from './dto/response/create-response.dto';
import {
  GetAllCertificationResponseDto,
  GetCertificationResponseDto,
} from './dto/response/read-response.dto';
import { UpdateCertificationResponseDto } from './dto/response/update-response.dto';
import { DeleteCertificationResponseDto } from './dto/response/delete-response.dto';

@Controller('certifications')
export class CertificationsController {
  constructor(private readonly certificationsService: CertificationsService) {}

  @Post()
  @ApiResponse({ type: CreateCertificationResponseDto })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SUPERADMIN)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'certificationDocs', maxCount: 5 }], {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const folder = './uploads/certificationDocs';

          if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
          }

          cb(null, folder);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  create(
    @Body() createCertificationDto: CreateCertificationDto,
    @UploadedFiles() files: { certificationDocs: Express.Multer.File[] },
  ) {
    const certificateMeta =
      files.certificationDocs?.map((file) => ({
        filename: file.originalname,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size,
      })) ?? [];
    return this.certificationsService.create(createCertificationDto, {
      certificateMeta: certificateMeta,
    });
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiResponse({ type: GetAllCertificationResponseDto })
  findAll(@Query() filters: CertificationFilterDto) {
    return this.certificationsService.findAll(filters);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiResponse({ type: GetCertificationResponseDto })
  findOne(@Param('id') id: string) {
    return this.certificationsService.findOne(id);
  }

  @Get('product-certs/:id')
  @ApiResponse({ type: [GetCertificationResponseDto] })
  findProductCerts(@Param('id') id: string) {
    return this.certificationsService.findCertificates(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiResponse({ type: UpdateCertificationResponseDto })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'certificationDocs', maxCount: 5 }], {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const folder = './uploads/certificationDocs';

          if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
          }

          cb(null, folder);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  @ApiQuery({
    name: 'replaceCerts',
    required: false,
    type: Boolean,
    description:
      'If true, replaces all existing certifications. If false or omitted, appends to existing.',
    example: false,
  })
  update(
    @Param('id') id: string,
    @Body() updateCertificationDto: UpdateCertificationDto,
    @UploadedFiles() files: { certificationDocs?: Express.Multer.File[] },
    @Query('replaceCerts') replaceCert?: string,
  ) {
    const certificateMeta =
      files.certificationDocs?.map((file) => ({
        filename: file.originalname,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size,
      })) ?? [];
    if (certificateMeta.length > 0) {
      return this.certificationsService.update(
        id,
        updateCertificationDto,
        { replaceCert: replaceCert === 'true' },
        {
          certificateMeta: certificateMeta,
        },
      );
    } else {
      return this.certificationsService.update(id, updateCertificationDto, {
        replaceCert: replaceCert === 'true',
      });
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiResponse({ type: DeleteCertificationResponseDto })
  remove(@Param('id') id: string) {
    return this.certificationsService.remove(id);
  }
}
