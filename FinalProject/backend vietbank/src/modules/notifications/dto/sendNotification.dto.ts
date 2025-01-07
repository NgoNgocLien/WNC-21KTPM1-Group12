import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

@ApiSchema({
  description: 'Gửi thông báo',
})
export class SendNotificationDto {
  @ApiProperty({
    description: 'Tiêu đề thông báo',
    example: 'Thông báo mới',
    required: true,
  })
  @IsString()
  @IsDefined()
  title: string;

  @ApiProperty({
    description: 'Nội dung thông báo',
    example: 'Một thông báo mới được gửi tới bạn',
    required: true,
  })
  @IsString()
  @IsDefined()
  body: string;
}
