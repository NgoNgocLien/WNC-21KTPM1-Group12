import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/createNotification.dto';
import { UpdateNotificationDto } from './dto/updateNotification.dto';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SendNotificationDto } from './dto/sendNotification.dto';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Notifications')
@ApiResponse({ status: 400, description: 'Yêu cầu không hợp lệ' })
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // @Post()
  // create(@Body() createNotificationDto: CreateNotificationDto) {
  //   return this.notificationsService.create(createNotificationDto);
  // }

  // @Get()
  // findAll() {
  //   return this.notificationsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.notificationsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateNotificationDto: UpdateNotificationDto,
  // ) {
  //   return this.notificationsService.update(+id, updateNotificationDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.notificationsService.remove(+id);
  // }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Gửi thông báo thành công',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Gửi thông báo thành công',
        },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: 'ID của khách hàng',
    example: 1,
    required: true,
  })
  @Public()
  @Post('send/:id')
  async sendNotification(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: SendNotificationDto,
  ) {
    return this.notificationsService.sendNotification(
      id,
      body.title,
      body.body,
    );
  }
}
