import { Controller, Get, Body} from '@nestjs/common';
import { LogsService } from './logs.service';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  async getLogs(@Body() body: { from: string, until: string, level: string, limit: number }) {
    return this.logsService.queryLogs(body.from, body.until, body.level, body.limit);
  }
}
