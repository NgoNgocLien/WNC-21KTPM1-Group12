import { Controller, Post, Body, Param, HttpStatus } from '@nestjs/common';
import { OtpService } from './otp.service';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SendOtpDto } from './dto/sendOtp.dto';
import { VerifyOtpDto } from './dto/verifyOtp.dto';

@ApiTags('OTP')
@ApiBearerAuth('access-token')
@ApiResponse({
  status: HttpStatus.BAD_REQUEST,
  description: 'Yêu cầu không hợp lệ',
})
@ApiResponse({
  status: HttpStatus.UNAUTHORIZED,
  description: 'Không có quyền truy cập',
})
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Lỗi server',
})
@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  // Generate and send OTP
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Gửi mã OTP thành công',
  })
  @Post('send')
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    await this.otpService.generateAndSendOtp(sendOtpDto.email);
  }

  // Verify OTP
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Xác thực mã OTP thành công',
  })
  @Post('verify')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.otpService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp);
  }
}
