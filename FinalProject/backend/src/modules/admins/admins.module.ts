import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Module({
  controllers: [AdminsController],
  providers: [AdminsService, PrismaService],
  exports: [AdminsService],
})
export class AdminsModule {}
