import {
  Injectable,
  InternalServerErrorException,
  Inject,
  LoggerService,
} from '@nestjs/common';
import { CreateNotificationDto } from './dto/createNotification.dto';
import { UpdateNotificationDto } from './dto/updateNotification.dto';
import * as admin from 'firebase-admin';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class NotificationsService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly prisma: PrismaService,
  ) {}

  // create(createNotificationDto: CreateNotificationDto) {
  //   return 'This action adds a new notification';
  // }

  // findAll() {
  //   return `This action returns all notifications`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} notification`;
  // }

  // update(id: number, updateNotificationDto: UpdateNotificationDto) {
  //   return `This action updates a #${id} notification`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} notification`;
  // }

  async sendNotification(id: number, title: string, body: string) {
    try {
      const customer = await this.prisma.customers.findUnique({
        where: { id },
        select: { fcm_token: true },
      });
      if (!customer) {
        return;
      }
      const fcm_token = customer.fcm_token;
      if (!fcm_token) {
        return;
      }
      return admin.messaging().send({
        notification: {
          title,
          body,
        },
        token: fcm_token,
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Lỗi hệ thống');
    }
  }
}
