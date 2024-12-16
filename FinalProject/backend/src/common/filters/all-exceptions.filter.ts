import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
  Inject,
  LoggerService,
  HttpServer,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  constructor(
    private readonly httpAdapter: HttpServer,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    super(httpAdapter);
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let responseObject = {};

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      responseObject = exception.getResponse();
    } else if (exception instanceof PrismaClientKnownRequestError) {
      statusCode = HttpStatus.BAD_REQUEST;
      responseObject = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: exception.message,
      };
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      responseObject = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      };
    }

    // response.status(statusCode).json(responseObject);

    // Log the error with stack trace if available
    const errorMessage = `Response: ${request.method} ${request.originalUrl} - Status: ${statusCode} - Body: ${JSON.stringify(responseObject)} - ${request.ip}`;
    const stack = exception instanceof Error ? exception.stack : null;

    this.logger.error(
      errorMessage,
      stack || undefined,
      AllExceptionsFilter.name,
    );

    super.catch(exception, host);
  }
}