import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsDefined, IsEmail } from 'class-validator';

@ApiSchema({
  description: 'Gửi mã OTP',
})
export class SendOtpDto {
  @ApiProperty({
    description: 'Email người dùng',
    example: 'johndoe@example.com',
    required: true,
  })
  @IsEmail()
  @IsDefined()
  email: string;
}
