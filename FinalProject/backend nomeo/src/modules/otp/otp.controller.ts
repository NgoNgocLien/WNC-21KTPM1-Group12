import { Controller, Post, Body, Param } from '@nestjs/common';
import { OtpService } from './otp.service';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  // Generate and send OTP
  @Post('send')
  async sendOtp(@Body('email') email: string) {
    await this.otpService.generateAndSendOtp(email);
  }

  // Verify OTP
  @Post('verify')
  async verifyOtp(
    @Body('email') email: string,
    @Body('otp') otp: string,
  ) {
    return this.otpService.verifyOtp(email, otp);
  }
}
