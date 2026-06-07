import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

/**
 * Translates known Prisma errors into clean HTTP responses so we never leak
 * raw ORM internals to clients. Services may also catch P2002/P2025 locally;
 * this is the global safety net.
 */
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('PrismaExceptionFilter');

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database error';
    let error = 'Database Error';

    switch (exception.code) {
      case 'P2002': {
        statusCode = HttpStatus.CONFLICT;
        const target = (exception.meta?.target as string[])?.join(', ') ?? 'field';
        message = `A record with this ${target} already exists`;
        error = 'Conflict';
        break;
      }
      case 'P2025': {
        statusCode = HttpStatus.NOT_FOUND;
        message = (exception.meta?.cause as string) ?? 'Record not found';
        error = 'Not Found';
        break;
      }
      case 'P2003': {
        statusCode = HttpStatus.BAD_REQUEST;
        message = 'Related record not found (foreign key constraint failed)';
        error = 'Bad Request';
        break;
      }
      default:
        this.logger.error(`Unhandled Prisma error ${exception.code}: ${exception.message}`);
    }

    response.status(statusCode).json({
      success: false,
      statusCode,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
