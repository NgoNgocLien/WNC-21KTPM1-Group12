import { ApiSchema } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsDateString, IsDefined, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsOptional()
  recipient_type?: string;

  @IsString()
  @IsDefined()
  notification_title: string;

  @IsString()
  @IsDefined()
  notification_body: string;

  @IsOptional()
  is_read: boolean;

  @IsOptional()
  notification_data?: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue;

  @IsDateString()
  @IsOptional()
  created_at?: string;
}
