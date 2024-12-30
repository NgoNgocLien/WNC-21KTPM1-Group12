import { Module } from '@nestjs/common';
import { DebtsService } from './debts.service';
import { DebtsController } from './debts.controller';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Module({
  controllers: [DebtsController],
  providers: [DebtsService, PrismaService, NotificationsService],
})
export class DebtsModule {}
