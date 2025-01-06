import { Role } from '../types/Role';
import { IsDefined, IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Tên đăng nhập',
    example: 'john_doe',
    required: true,
  })
  @IsString()
  @IsDefined()
  username: string;

  @ApiProperty({
    description: 'Mật khẩu',
    example: '123456',
    required: true,
  })
  @IsString()
  @IsDefined()
  password: string;

  @ApiProperty({
    description: 'Vai trò',
    enum: Role,
    example: 'customer',
    required: true,
  })
  @IsString()
  @IsDefined()
  @IsEnum(Role)
  role: Role;

  @ApiProperty({
    description:
      'Token từ Firebase Cloud Messaging, cho phép gửi thông báo đến thiết bị',
    example: 'fcm_token',
    required: true,
  })
  @IsString()
  @IsDefined()
  fcm_token: string;
}
