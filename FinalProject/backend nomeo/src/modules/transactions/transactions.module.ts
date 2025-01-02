import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { BanksService } from '../banks/banks.service';
import { CustomersService } from '../customers/customers.service';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, PrismaService, BanksService, CustomersService],
})
export class TransactionsModule {}
