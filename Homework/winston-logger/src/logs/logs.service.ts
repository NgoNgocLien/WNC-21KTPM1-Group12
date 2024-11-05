import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as winston from 'winston';

@Injectable()
export class LogsService {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: winston.Logger) {}

  queryLogs(from: string, until: string, level: string, limit: number) {
    const options = {
      from: new Date(from),
      until: new Date(until),
      limit: limit,
      order: 'desc' as 'desc' | 'asc',
      fields: ['message', 'level', 'timestamp'],
      level: level,
    };

    return new Promise((resolve, reject) => {
      this.logger.query(options, (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      });
    });
    
  }
}
