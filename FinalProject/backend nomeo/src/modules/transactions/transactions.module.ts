import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { BanksService } from '../banks/banks.service';
import { CustomersService } from '../customers/customers.service';
import { AuthService } from '../auth/auth.service';
import { EmployeesService } from '../employees/employees.service';
import { AdminsService } from '../admins/admins.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, PrismaService, BanksService, CustomersService, 
    AuthService, EmployeesService, AdminsService, JwtService

  ],
})
export class TransactionsModule {}
