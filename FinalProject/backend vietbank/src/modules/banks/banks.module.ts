import { forwardRef, Module } from '@nestjs/common';
import { BanksService } from './banks.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { CustomersModule } from '../customers/customers.module';
import { EmployeesModule } from '../employees/employees.module';
import { JwtModule } from '@nestjs/jwt';
import { AdminsModule } from '../admins/admins.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    JwtModule.register({}),
    EmployeesModule,
    AdminsModule,
    forwardRef(() => CustomersModule),
    forwardRef(() => AuthModule)
  ],
  controllers: [],
  providers: [BanksService, PrismaService],
  exports: [BanksService]
})
export class BanksModule {}
