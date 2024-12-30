import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/createNotification.dto';
import { UpdateNotificationDto } from './dto/updateNotification.dto';
import * as admin from 'firebase-admin';

@Injectable()
export class NotificationsService {
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

  async sendNotification(title: string, body: string, token: string) {
    return admin.messaging().send({
      notification: {
        title,
        body,
      },
      token,
    });
  }
}
