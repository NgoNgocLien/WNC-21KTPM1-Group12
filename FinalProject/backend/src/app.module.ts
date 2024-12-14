import { Module } from '@nestjs/common';
// import { CustomersService } from './customers/customers.service';
// import { CustomersModule } from './customers/customers.module';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule, utilities } from 'nest-winston';
import { AuthModule } from './auth/auth.module';
import * as winston from 'winston';
import { PrismaService } from './prisma/prisma.service';

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
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {
}
