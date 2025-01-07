import { forwardRef, Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { BanksModule } from '../banks/banks.module';

@Module({
  imports: [
    forwardRef(() => BanksModule)
  ],
  providers: [CustomersService, PrismaService],
  controllers: [CustomersController],
  exports: [CustomersService],
})
export class CustomersModule {}
