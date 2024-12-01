import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { WinstonModule, utilities } from 'nest-winston';
import * as winston from 'winston';
import { LogsController } from './logs.controller';
import 'winston-daily-rotate-file';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            utilities.format.nestLike('Nest', {
              colors: true,
              prettyPrint: true,
              processId: true,
              appName: true,
            }),
          ),
        }),

        new winston.transports.File({
          filename: 'info.log',
          level: 'info',
          dirname: 'logs',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            winston.format.json(),
          ),
        }),

        new winston.transports.File({
          filename: 'error.log',
          level: 'error',
          dirname: 'logs',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            winston.format.json(),
          ),
        }),

        new winston.transports.File({
          filename: 'warn.log',
          level: 'warn',
          dirname: 'logs',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            winston.format.json(),
          ),
        }),

        new winston.transports.DailyRotateFile({
          filename: 'application-%DATE%.log',      // %DATE% sẽ được thay bằng ngày tháng
          datePattern: 'YYYY-MM',                  // Cấu trúc tên file
          zippedArchive: true,                     // Nén các file cũ
          maxSize: '20m',                          // Giới hạn kích thước file, nếu vượt quá sẽ tạo file mới
          maxFiles: '14d',                         // Giữ lại các file log trong 14 ngày, sau 14 ngày sẽ xóa file cũ (file cũ sẽ được nén)
          dirname: 'logs/rotation',                // Thư mục chứa file log
          json: true,                              // Định dạng file log
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            winston.format.json(),
          ),
        }),
      ],
    }),
  ],
  providers: [LogsService],
  controllers: [LogsController],
})
export class LogsModule {}
