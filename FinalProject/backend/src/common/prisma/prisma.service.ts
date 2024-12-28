import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      this.logger.log('Connecting to the database...');
      await this.$connect();
      this.logger.log('Connected to the database');
    } catch (error) {
      this.logger.error('Failed to connect to the database', error);
      throw error;
    }
  }
  
  async onModuleDestroy() {
    try {
      this.logger.log('Disconnecting from the database...');
      await this.$disconnect();
      this.logger.log('Disconnected from the database');
    } catch (error) {
      this.logger.error('Failed to disconnect from the database', error);
      throw error;
    }
  }
}
