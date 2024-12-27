import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    console.log('Connecting to the database...');
    await this.$connect();
    console.log('Connected to the database');
  }
  
  async onModuleDestroy() {
    console.log('Disconnecting from the database...');
    await this.$disconnect();
    console.log('Disconnected from the database');
  }
}
