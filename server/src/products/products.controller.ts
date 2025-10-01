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
  Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/request/create-product.dto';
import { UpdateProductDto } from './dto/request/update-product.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { extname } from 'path';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
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
import { UserRequest } from 'src/users/entities/UserRequest.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
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
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiResponse({ type: GetAllProductResponseDto, status: 200 })
  findAll(
    @Query() filters: productFilterDto,
    @Req() req: Request & { user: UserRequest },
  ) {
    return this.productsService.findAll(filters, req.user);
  }

  @Get(':id')
  @ApiResponse({ type: GetProductResponseDto, status: 200 })
  findOne(
    @Param('id') id: string,
    @Req() req: Request & { user: UserRequest },
  ) {
    return this.productsService.findOne(+id, req.user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
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
    @Req() req: Request & { user: UserRequest },
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
      req.user,
      { certificateMeta: certificateMeta, imageMeta: imageMeta },
      {
        replaceCerts: replaceCerts === 'true',
        replaceImages: replaceImages === 'true',
      },
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiResponse({ type: DeleteProductResponseDto, status: 200 })
  remove(@Param('id') id: string, @Req() req: Request & { user: UserRequest }) {
    return this.productsService.remove(+id, req.user);
  }
}
