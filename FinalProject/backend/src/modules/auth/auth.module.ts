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
    {
      provide: 'APP_GUARD',
      useClass: AccessTokenGuard,
    },
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
