import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';

import { PrismaService } from 'src/common/prisma/prisma.service';
import { TransactionsService } from '../transactions/transactions.service';
import { BanksService } from '../banks/banks.service';

@Module({
  controllers: [EmployeesController],
  providers: [EmployeesService, PrismaService, ],
  exports: [EmployeesService],
})
export class EmployeesModule {}
