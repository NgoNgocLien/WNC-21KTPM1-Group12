import { ApiHideProperty, ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

@ApiSchema({
  description: 'Tạo tài khoản khách hàng',
})
export class CreateCustomerDto implements Prisma.customersCreateInput {
  @ApiProperty({
    description: 'Tên đăng nhập',
    example: 'nguyenvana',
    required: true,
  })
  @IsString()
  @Length(1, 50)
  username: string;

  @ApiProperty({
    description: 'Mật khẩu',
    example: '123456',
    required: true,
  })
  @IsString()
  @Length(6, 100)
  password: string;

  @ApiProperty({
    description: 'Họ và tên',
    example: 'Nguyễn Văn A',
    required: true,
  })
  @IsString()
  @Length(1, 100)
  fullname: string;

  @ApiProperty({
    description: 'Email',
    example: 'nguyenvana@example.com',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Số điện thoại',
    example: '0987654321',
    required: true,
  })
  @IsPhoneNumber('VN')
  phone: string;

  @ApiHideProperty()
  @IsOptional()
  refresh_token: string;

  @ApiHideProperty()
  @IsOptional()
  fcm_token: string;
}
