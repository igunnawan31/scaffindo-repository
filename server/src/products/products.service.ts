import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/request/create-product.dto';
import { FileMetaData } from 'src/types/FileMeta.dto';
import { CreateProductResponseDto } from './dto/response/create-response.dto';
import { Prisma, ProductCategory, Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { handlePrismaError } from 'src/common/utils/prisma-exception.util';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { productFilterDto } from './dto/request/product-filter.dto';
import { UpdateProductDto } from './dto/request/update-product.dto';
import {
  GetAllProductResponseDto,
  GetProductResponseDto,
} from './dto/response/read-response.dto';
import { meta } from 'src/types/meta.dto';
import { UpdateProductResponseDto } from './dto/response/update-response.dto';
import { deleteFileArray } from 'src/utils/fileHelper';
import { DeleteProductResponseDto } from './dto/response/delete-response.dto';
import { GetCertificationResponseDto } from 'src/certifications/dto/response/read-response.dto';
import { UserRequest } from 'src/users/entities/UserRequest.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    createProductDto: CreateProductDto,
    filesMeta: {
      // certificateMeta: FileMetaData[];
      imageMeta: any[];
    },
  ): Promise<CreateProductResponseDto> {
    const { name, description, price, companyId, categories, certifications } =
      createProductDto;
    // const { certificateMeta, imageMeta } = filesMeta;
    const { imageMeta } = filesMeta;

    // =============================
    // 1. VALIDATE CATEGORIES
    // =============================
    if (categories && categories.length > 0) {
      const validCategories = Object.values(ProductCategory);
      for (const cat of categories) {
        if (!validCategories.includes(cat as ProductCategory)) {
          throw new BadRequestException(`Invalid category: ${cat}`);
        }
      }
    }

    // =============================
    // 2. VALIDATE CERTIFICATION ↔ METADATA MATCH
    // =============================
    // if (certifications && certifications?.length > 0) {
    //   if (!certificateMeta || certificateMeta.length === 0) {
    //     throw new BadRequestException(
    //       'Certificate metadata required when certifications provided.',
    //     );
    //   }
    //   if (certifications.length !== certificateMeta.length) {
    //     throw new BadRequestException(
    //       `Mismatch: ${certifications.length} certifications but ${certificateMeta.length} metadata provided.`,
    //     );
    //   }
    // } else if (!certifications && certificateMeta.length > 0) {
    //   throw new BadRequestException(
    //     'Certificate required when certificate metadata provided.',
    //   );
    // }

    // =============================
    // 3. TRANSACTION: CREATE PRODUCT + CERTIFICATIONS
    // =============================
    let productWithCerts: Prisma.ProductGetPayload<{
      include: { certifications: true };
    }> | null = null;
    try {
      productWithCerts = await this.prisma.$transaction(async (tx) => {
        // Create Product
        const product = await tx.product.create({
          data: {
            name,
            description,
            price,
            companyId,
            category: {
              set: categories as ProductCategory[],
            },
            image: imageMeta,
          },
        });

        // Create Certifications (if any)
        if (certifications && certifications.length > 0) {
          await tx.certification.createMany({
            data: certifications.map((cert) => ({
              name: cert.name,
              expired: new Date(cert.expired),
              details: cert.details,
              // document: [
              //   {
              //     filename: certificateMeta[index].filename,
              //     path: certificateMeta[index].path,
              //     size: certificateMeta[index].size,
              //     mimetype: certificateMeta[index].mimetype,
              //   },
              // ],
              productId: product.id,
            })),
          });
        }

        const result = await tx.product.findUnique({
          where: { id: product.id },
          include: { certifications: true },
        });

        return result;
      });
    } catch (error) {
      handlePrismaError(error, 'Product');
    }

    if (!productWithCerts) {
      throw new InternalServerErrorException(
        'Failed to retrieve created product',
      );
    }

    // =============================
    // 4. MAP & RETURN DTO
    // =============================

    const response = {
      id: productWithCerts.id,
      name: productWithCerts.name,
      description: productWithCerts.description,
      price: productWithCerts.price.toString(),
      companyId: productWithCerts.companyId,
      categories: productWithCerts.category || [],
      certifications: productWithCerts.certifications.map((cert) => cert.id),
      image: productWithCerts.image,
      // certifications: (productWithCerts.certifications || []).map((cert) =>
      //   plainToInstance(GetCertificationResponseDto, {
      //     id: cert.id,
      //     name: cert.name,
      //     expired: cert.expired.toISOString().split('T')[0],
      //     details: cert.details,
      //     document: cert.document,
      //     productId: cert.productId?.toString(),
      //   }),
      // ),
    };

    return plainToInstance(CreateProductResponseDto, response);
  }

  async findAll(
    filters: productFilterDto,
    user: UserRequest,
  ): Promise<GetAllProductResponseDto> {
    try {
      const {
        searchTerm,
        minPrice,
        companyId,
        categories,
        page = 1,
        limit = 10,
        sortBy,
        sortOrder,
      } = filters;
      const skip = (page - 1) * limit;

      const where: Prisma.ProductWhereInput = {
        companyId: user.role === Role.SUPERADMIN ? undefined : user.companyId,
      };

      if (searchTerm) {
        where.OR = [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
        ];
      }

      if (minPrice !== undefined) {
        where.price = { gte: minPrice };
      }

      if (companyId) {
        where.companyId = companyId;
      }

      if (categories && categories.length > 0) {
        // Validate and cast to enum
        const validCategories = Object.values(ProductCategory);
        const filtered = categories.filter((cat) =>
          validCategories.includes(cat as ProductCategory),
        );

        if (filtered.length > 0) {
          where.category = { hasSome: filtered as ProductCategory[] };
        }
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

      const [products, total] = await Promise.all([
        this.prisma.product.findMany({
          where,
          skip,
          take: limit,
          include: {
            certifications: { select: { id: true } },
            labels: { select: { id: true } },
            Invoice: { select: { id: true } },
          },
          orderBy,
        }),
        this.prisma.product.count({ where }),
      ]);
      const meta: meta = {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      };

      return plainToInstance(GetAllProductResponseDto, {
        data: products.map((p) =>
          plainToInstance(GetProductResponseDto, {
            ...p,
            labels: p.labels.map((l) => l.id),
            certifications: p.certifications.map((c) => c.id),
            Invoice: p.Invoice.map((i) => i.id),
          }),
        ),
        meta,
      });
    } catch (err) {
      handlePrismaError(err, 'Product');
    }
  }

  // =============================
  // FIND ONE
  // =============================
  async findOne(id: number, user: UserRequest): Promise<GetProductResponseDto> {
    try {
      const product = await this.prisma.product.findUnique({
        where: {
          id: id,
          companyId: user.role === Role.SUPERADMIN ? undefined : user.companyId,
        },
        include: {
          labels: true,
          certifications: true,
          Invoice: true,
        },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      return plainToInstance(GetProductResponseDto, product);
    } catch (err) {
      handlePrismaError(err, 'Product', id);
    }
  }

  // =============================
  // UPDATE
  // =============================

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    user: UserRequest,
    filesMeta: {
      certificateMeta?: any[];
      imageMeta?: any[];
    },
    options?: {
      replaceCerts?: boolean;
      replaceImages?: boolean;
    },
  ): Promise<UpdateProductResponseDto> {
    const { certificateMeta, imageMeta } = filesMeta;

    try {
      // 1. Validate categories if provided
      if (updateProductDto.categories) {
        const validCategories = Object.values(ProductCategory);
        for (const cat of updateProductDto.categories) {
          if (!validCategories.includes(cat as ProductCategory)) {
            throw new BadRequestException(`Invalid category: ${cat}`);
          }
        }
      }

      // 2. Fetch existing product (for file cleanup)
      const existingProduct = await this.findOne(id, user);
      if (!existingProduct) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      // 3. TRANSACTION
      const productWithCerts = await this.prisma.$transaction(async (tx) => {
        // Prepare update data
        const updateData: Prisma.ProductUpdateInput = {
          name: updateProductDto.name ?? undefined,
          description: updateProductDto.description ?? undefined,
          price: updateProductDto.price ?? undefined,
          category: updateProductDto.categories
            ? { set: updateProductDto.categories as ProductCategory[] }
            : undefined,
        };

        // Handle IMAGES
        if (imageMeta && imageMeta.length > 0) {
          if (options?.replaceImages) {
            // REPLACE: Delete old image files, use new
            if (existingProduct.image) {
              const imagesToDelete = Array.isArray(existingProduct.image)
                ? (existingProduct.image as FileMetaData[])
                : [existingProduct.image as FileMetaData];

              await deleteFileArray(imagesToDelete, 'image');
            }
            updateData.image = imageMeta.map((img) =>
              instanceToPlain(img),
            ) as Prisma.InputJsonValue;
          } else {
            // APPEND: Merge old + new
            const oldImages = existingProduct.image
              ? Array.isArray(existingProduct.image)
                ? (existingProduct.image as any[]).map((img) =>
                    instanceToPlain(img),
                  )
                : [instanceToPlain(existingProduct.image)]
              : [];

            const newImages = imageMeta.map((img) => instanceToPlain(img));
            const finalImages = [...oldImages, ...newImages];

            updateData.image = finalImages as Prisma.InputJsonValue;
          }
        }

        // Handle CERTIFICATIONS
        if (
          !updateProductDto.certifications &&
          certificateMeta &&
          certificateMeta.length > 0
        ) {
          throw new BadRequestException(
            `Mismatch: certifications data in DTO but ${certificateMeta.length} metadata provided.`,
          );
        }
        if (certificateMeta && certificateMeta.length > 0) {
          // Validate length
          if (
            !updateProductDto.certifications ||
            updateProductDto.certifications.length !== certificateMeta.length
          ) {
            throw new BadRequestException(
              `Mismatch: ${updateProductDto.certifications?.length || 0} certifications in DTO but ${certificateMeta.length} metadata provided.`,
            );
          }

          // Handle existing certifications based on replaceCerts option
          if (options?.replaceCerts) {
            // REPLACE: Delete old certifications + files
            if (
              existingProduct.certifications &&
              existingProduct.certifications.length > 0
            ) {
              // Delete files
              await Promise.all(
                existingProduct.certifications.map(async (cert) => {
                  if (cert.document) {
                    const docsToDelete = Array.isArray(cert.document)
                      ? (cert.document as FileMetaData[])
                      : [cert.document as FileMetaData];
                    await deleteFileArray(docsToDelete, 'certificationDoc');
                  }
                }),
              );

              // Delete from DB
              await tx.certification.deleteMany({
                where: { productId: id },
              });
            }

            // Create new certifications
            await tx.certification.createMany({
              data: updateProductDto.certifications.map((certDto, index) => ({
                name: certDto.name,
                expired: new Date(certDto.expired),
                details: certDto.details,
                document: [instanceToPlain(certificateMeta[index])],
                productId: id,
              })),
            });
          } else {
            // APPEND: Just add new certifications without deleting existing ones
            await tx.certification.createMany({
              data: updateProductDto.certifications.map((certDto, index) => ({
                name: certDto.name,
                expired: new Date(certDto.expired),
                details: certDto.details,
                document: [instanceToPlain(certificateMeta[index])],
                productId: id,
              })),
            });
          }
        } else if (
          options?.replaceCerts &&
          updateProductDto.certifications === undefined
        ) {
          // Special case: If replaceCerts is true but no new certs provided, delete all existing
          if (
            existingProduct.certifications &&
            existingProduct.certifications.length > 0
          ) {
            // Delete files
            await Promise.all(
              existingProduct.certifications.map(async (cert) => {
                if (cert.document) {
                  const docsToDelete = Array.isArray(cert.document)
                    ? (cert.document as FileMetaData[])
                    : [cert.document as FileMetaData];
                  await deleteFileArray(docsToDelete, 'certification');
                }
              }),
            );

            // Delete from DB
            await tx.certification.deleteMany({
              where: { productId: id },
            });
          }
        }

        // Update the product
        const updatedProduct = await tx.product.update({
          where: { id },
          data: updateData,
          include: { certifications: true },
        });

        return updatedProduct;
      });

      if (!productWithCerts) {
        throw new InternalServerErrorException(
          'Failed to retrieve updated product',
        );
      }

      return plainToInstance(UpdateProductResponseDto, productWithCerts);
    } catch (err) {
      // Clean up uploaded files if transaction fails
      if (certificateMeta && certificateMeta.length > 0) {
        await deleteFileArray(
          certificateMeta as FileMetaData[],
          'certification',
        ).catch(console.warn);
      }
      if (imageMeta && imageMeta.length > 0) {
        await deleteFileArray(imageMeta as FileMetaData[], 'image').catch(
          console.warn,
        );
      }

      handlePrismaError(err, 'Product', id);
    }
  }

  async remove(
    id: number,
    user: UserRequest,
  ): Promise<DeleteProductResponseDto> {
    try {
      const product = await this.findOne(id, user);
      if (!product) throw new NotFoundException(`Product ${id} not found`);
      // Delete all associated files with proper typing
      await Promise.all([deleteFileArray(product.image, 'image')]);
      await Promise.all([
        deleteFileArray(
          product.certifications.flatMap(
            (c) => c.document,
          ) as unknown as FileMetaData[],
          'image',
        ),
      ]);
      const query = await this.prisma.product.delete({
        where: { id },
        include: { certifications: true },
      });
      return plainToInstance(DeleteProductResponseDto, {
        ...query,
        certifications: plainToInstance(
          GetCertificationResponseDto,
          query.certifications,
        ),
      });
    } catch (error) {
      handlePrismaError(error, 'Product', id);
    }
  }
}
