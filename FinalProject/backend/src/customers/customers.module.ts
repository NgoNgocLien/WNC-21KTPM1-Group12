import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [CustomersService, PrismaService],
  controllers: [CustomersController],
  exports: [CustomersService],
})
export class CustomersModule {}
