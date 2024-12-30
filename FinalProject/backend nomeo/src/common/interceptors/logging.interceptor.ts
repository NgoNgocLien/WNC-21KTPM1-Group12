import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  LoggerService,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    this.logger.log(
      `Request: ${request.method} ${request.originalUrl} - Body: ${JSON.stringify(
        request.body,
      )} - ${request.ip}`,
      LoggingInterceptor.name,
    );

    // this.logger.log(`Response: POST /api/filmsA - Body: ${JSON.stringify(data)} - ${ip}`, FilmsController.name);
    return next.handle().pipe(
      tap((data) => {
        const statusCode = response.statusCode;
        this.logger.log(
          `Response: ${request.method} ${request.originalUrl} - Status: ${statusCode} - Body: ${JSON.stringify(data)} - ${request.ip}`,
          LoggingInterceptor.name,
        );
      }),
    );
  }
}
