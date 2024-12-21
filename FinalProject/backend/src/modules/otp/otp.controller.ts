import { Controller, Post, Body, Param } from '@nestjs/common';
import { OtpService } from './otp.service';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  // Generate and send OTP
  @Post('send')
  async sendOtp(@Body('email') email: string): Promise<void> {
    await this.otpService.generateAndSendOtp(email);
  }

  // Verify OTP
  @Post('verify/:email')
  async verifyOtp(
    @Param('email') email: string,
    @Body('otp') otp: string,
  ): Promise<boolean> {
    return this.otpService.verifyOtp(email, otp);
  }
}
