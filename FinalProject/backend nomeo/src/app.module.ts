import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule, utilities } from 'nest-winston';
import { PrismaService } from './common/prisma/prisma.service';
import * as winston from 'winston';

import { AuthModule } from './modules/auth/auth.module';
import { CustomersModule } from './modules/customers/customers.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { AdminsModule } from './modules/admins/admins.module';
import { DebtsModule } from './modules/debts/debts.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { OtpModule } from './modules/otp/otp.module';

import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AuthService } from './modules/auth/auth.service';
import { BanksModule } from './modules/banks/banks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            utilities.format.nestLike('Nest', {
              colors: true,
              prettyPrint: true,
              processId: true,
              appName: true,
            }),
          ),
        }),
      ],
    }),
    AuthModule,
    CustomersModule,
    EmployeesModule,
    AdminsModule,
    DebtsModule,
    TransactionsModule,
    OtpModule,
    NotificationsModule,
    BanksModule,
  ],
  controllers: [],
  providers: [
    PrismaService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
