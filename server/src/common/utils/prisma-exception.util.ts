import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

export function handlePrismaError(
  error: unknown,
  entityName = 'Record',
  id?: number | string,
): never {
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': // unique constraint violation
        throw new ConflictException(`${entityName} already exists`);
      case 'P2003': // foreign key constraint violation
        throw new BadRequestException(
          `Invalid foreign key reference for ${entityName}`,
        );
      case 'P2025': // record not found
        throw new NotFoundException(
          `${entityName} with id ${id ?? 'unknown'} not found`,
        );
    }
  }

  if (error instanceof PrismaClientValidationError) {
    throw new BadRequestException(
      `${entityName} validation failed: ${error.message}`,
    );
  }

  // Fallback: include original error message for easier debugging
  const message =
    error instanceof Error
      ? `${entityName} database operation failed: ${error.message}`
      : `${entityName} database operation failed`;

  throw new InternalServerErrorException(message);
}
