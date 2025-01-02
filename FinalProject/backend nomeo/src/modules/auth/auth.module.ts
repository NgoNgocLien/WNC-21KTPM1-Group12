import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { CustomersModule } from 'src/modules/customers/customers.module';
import { EmployeesModule } from 'src/modules/employees/employees.module';
import { AdminsModule } from 'src/modules/admins/admins.module';

import { JwtModule } from '@nestjs/jwt';
import { AccessTokenGuard } from './guards/accessToken.guard';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { TransactionStrategy } from './strategies/transaction.strategy';
import { BanksService } from '../banks/banks.service';
import { CustomerInfoStrategy } from './strategies/customerInfo.strategy';

@Module({
  imports: [
    JwtModule.register({}),
    CustomersModule,
    EmployeesModule,
    AdminsModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    BanksService,
    {
      provide: 'APP_GUARD',
      useClass: AccessTokenGuard,
    },
    AccessTokenStrategy,
    RefreshTokenStrategy,
    TransactionStrategy,
    CustomerInfoStrategy,
    PrismaService
  ],
  exports: [AuthService],
})
export class AuthModule {}
