import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/request/create-product.dto';
import { UpdateProductDto } from './dto/request/update-product.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { extname } from 'path';
import { ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateProductResponseDto } from './dto/response/create-response.dto';
import {
  GetAllProductResponseDto,
  GetProductResponseDto,
} from './dto/response/read-response.dto';
import { productFilterDto } from './dto/request/product-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UpdateProductResponseDto } from './dto/response/update-response.dto';
import { DeleteProductResponseDto } from './dto/response/delete-response.dto';

@Controller('products')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(Role.SUPERADMIN)
  @ApiResponse({
    type: CreateProductResponseDto,
    status: 201,
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        // { name: 'certificationDocs', maxCount: 5 },
        { name: 'image', maxCount: 3 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            // const folder =
            //   file.fieldname === 'certificationDocs'
            //     ? './uploads/certificationDocs'
            //     : './uploads/image';
            const folder = './uploads/image';

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
      },
    ),
  )
  create(
    @Body() dto: CreateProductDto,
    @UploadedFiles()
    files: {
      // certificationDocs?: Express.Multer.File[];
      image?: Express.Multer.File[];
    },
  ) {
    // const certificateMeta =
    //   files.certificationDocs?.map((file) => ({
    //     filename: file.originalname,
    //     path: file.path,
    //     mimetype: file.mimetype,
    //     size: file.size,
    //   })) ?? [];

    const imageMeta =
      files.image?.map((file) => ({
        filename: file.originalname,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size,
      })) ?? [];

    return this.productsService.create(dto, {
      // certificateMeta: certificateMeta,
      imageMeta: imageMeta,
    });
  }

  @Get()
  @Roles(Role.SUPERADMIN)
  @ApiResponse({ type: GetAllProductResponseDto, status: 200 })
  findAll(@Query() filters: productFilterDto) {
    return this.productsService.findAll(filters);
  }

  @Get(':id')
  @ApiResponse({ type: GetProductResponseDto, status: 200 })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({ type: UpdateProductResponseDto, status: 200 })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'certificationDocs', maxCount: 5 },
        { name: 'image', maxCount: 3 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            const folder =
              file.fieldname === 'certificationDocs'
                ? './uploads/certificationDocs'
                : './uploads/image';

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
      },
    ),
  )
  @ApiQuery({
    name: 'replaceCerts',
    required: false,
    type: Boolean,
    description:
      'If true, replaces all existing certifications. If false or omitted, appends to existing.',
    example: false,
  })
  @ApiQuery({
    name: 'replaceImages',
    required: false,
    type: Boolean,
    description:
      'If true, replaces all existing images. If false or omitted, appends to existing.',
    example: false,
  })
  update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles()
    files: {
      certificationDocs?: Express.Multer.File[];
      image?: Express.Multer.File[];
    },
    @Query('replaceCerts') replaceCerts?: string,
    @Query('replaceImages') replaceImages?: string,
  ) {
    const certificateMeta =
      files.certificationDocs?.map((file) => ({
        filename: file.originalname,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size,
      })) ?? [];

    const imageMeta =
      files.image?.map((file) => ({
        filename: file.originalname,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size,
      })) ?? [];

    // return this.productsService.update(id, updateProductDto, {
    //   certificateMeta: certificateMeta,
    //   imageMeta: imageMeta,
    // });
    return this.productsService.update(
      id,
      updateProductDto,
      { certificateMeta: certificateMeta, imageMeta: imageMeta },
      {
        replaceCerts: replaceCerts === 'true',
        replaceImages: replaceImages === 'true',
      },
    );
  }

  @Delete(':id')
  @ApiResponse({ type: DeleteProductResponseDto, status: 200 })
  @Roles(Role.SUPERADMIN)
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
