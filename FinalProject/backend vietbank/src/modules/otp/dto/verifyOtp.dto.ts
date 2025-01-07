import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsString } from 'class-validator';

@ApiSchema({
  description: 'Xác thực mã OTP',
})
export class VerifyOtpDto {
  @ApiProperty({
    description: 'Email người dùng',
    example: 'johndoe@example.com',
    required: true,
  })
  @IsEmail()
  @IsDefined()
  email: string;

  @ApiProperty({
    description: 'Mã OTP',
    example: '123456',
    required: true,
  })
  @IsString()
  @IsDefined()
  otp: string;
}
