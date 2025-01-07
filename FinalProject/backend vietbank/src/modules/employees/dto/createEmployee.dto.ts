import { Prisma } from '@prisma/client';
import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { employee_status } from '@prisma/client';
import { ApiHideProperty, ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
  description: 'Tạo nhân viên',
})
export class CreateEmployeeDto {
  @ApiProperty({
    description: 'Tên đăng nhập',
    example: 'employee20',
    required: true,
  })
  @IsString()
  @IsDefined()
  username: string;

  @ApiProperty({
    description: 'Mật khẩu',
    example: '123456',
    required: true,
  })
  @IsString()
  @IsDefined()
  password: string;

  @ApiProperty({
    description: 'Họ và tên',
    example: 'Phạm Minh Châu',
    required: true,
  })
  @IsString()
  @IsDefined()
  fullname: string;

  @ApiProperty({
    description: 'Email',
    example: 'chaupm@example.com',
    required: true,
  })
  @IsEmail()
  @IsString()
  @IsDefined()
  email: string;

  @ApiProperty({
    description: 'Số điện thoại',
    example: '0901231234',
    required: true,
  })
  // @IsPhoneNumber('VI')
  @IsString()
  @IsDefined()
  phone: string;

  @ApiHideProperty()
  @IsString()
  @IsOptional()
  refresh_token: string;

  @ApiHideProperty()
  @IsEnum(employee_status)
  @IsOptional()
  status: employee_status;
}
