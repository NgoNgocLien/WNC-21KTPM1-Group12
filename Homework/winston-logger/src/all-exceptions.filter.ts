
import { Catch, ArgumentsHost, HttpStatus, HttpException, Inject, LoggerService, HttpServer } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

type ResponseObject = {
  statusCode: number;
  timestamp: string;
  path: string;
  response: string | object;
}

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  constructor(
    private readonly httpAdapter: HttpServer,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
  ) {
    super(httpAdapter);
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const responseObject: ResponseObject = {
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path: request.url,
      response: '',
    };

    if (exception instanceof HttpException) {
      responseObject.statusCode = exception.getStatus();
      responseObject.response = exception.getResponse();
    } else if (exception instanceof PrismaClientKnownRequestError) {
      responseObject.statusCode = HttpStatus.BAD_REQUEST;
      responseObject.response = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: exception.message,
      };
    } else {
      responseObject.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      responseObject.response = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error",
      };
    }

    response
      .status(responseObject.statusCode)
      .json(responseObject.response);

    // Log the error with stack trace if available
    const errorMessage = "Response: " + JSON.stringify(responseObject);
    const stack = exception instanceof Error ? exception.stack : null;

    this.logger.error(errorMessage, stack || undefined, AllExceptionsFilter.name);

    super.catch(exception, host);
  }
}