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

@Controller('certifications')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CertificationsController {
  constructor(private readonly certificationsService: CertificationsService) {}

  @Post()
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
  create(@Body() createCertificationDto: CreateCertificationDto) {
    return this.certificationsService.create(createCertificationDto);
  }

  @Get()
  findAll(@Query() filters: CertificationFilterDto) {
    return this.certificationsService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.certificationsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.SUPERADMIN)
  update(
    @Param('id') id: string,
    @Body() updateCertificationDto: UpdateCertificationDto,
  ) {
    return this.certificationsService.update(+id, updateCertificationDto);
  }

  @Delete(':id')
  @Roles(Role.SUPERADMIN)
  remove(@Param('id') id: string) {
    return this.certificationsService.remove(+id);
  }
}
