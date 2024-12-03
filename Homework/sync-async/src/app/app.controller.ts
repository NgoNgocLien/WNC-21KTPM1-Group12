import { 
    Controller,
    Get 
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller('app')
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('sync')
    getSyncData(): string {
      return this.appService.getSyncData();
    }
  
    @Get('async')
    async getAsyncData(): Promise<string> {
      return await this.appService.getAsyncData();
    }
}
