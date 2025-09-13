import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { Response, Request } from 'express';
interface ExceptionResponseObj {
  statusCode: number;
  timestamp: string;
  path: string;
  response: string | object;
}

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorResponse: string | object = 'Internal Server Error';

    // Handle NestJS HttpException
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      errorResponse = typeof res === 'string' ? res : res;
    }
    // Handle Prisma known request error
    else if (exception instanceof PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002':
          status = HttpStatus.CONFLICT;
          errorResponse = 'Unique constraint failed';
          break;
        case 'P2003':
          status = HttpStatus.BAD_REQUEST;
          errorResponse = 'Invalid foreign key reference';
          break;
        case 'P2025':
          status = HttpStatus.NOT_FOUND;
          errorResponse = 'Record not found';
          break;
        default:
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          errorResponse = exception.message;
      }
    }
    // Prisma validation error
    else if (exception instanceof PrismaClientValidationError) {
      status = 422;
      errorResponse = exception.message.replace(/\n/g, ' ');
    }
    // Any other error
    else if (exception instanceof Error) {
      errorResponse = exception.message;
    }

    const responseObj: ExceptionResponseObj = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      response: errorResponse,
    };

    // Send response only if not already sent
    if (!response.headersSent) {
      response.status(status).json(responseObj);
    }

    // Safe logging
    const logMessage =
      typeof errorResponse === 'object'
        ? JSON.stringify(errorResponse)
        : errorResponse;

    this.logger.error(logMessage, (exception as Error)?.stack ?? undefined);
  }
}
