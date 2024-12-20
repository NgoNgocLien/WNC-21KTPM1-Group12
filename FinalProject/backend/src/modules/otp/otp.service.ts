import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import * as crypto from 'crypto';
import { sendMail } from 'src/common/utils/sendMail'; // Assuming you have a MailService to send emails
import { addMinutes } from 'date-fns';

@Injectable()
export class OtpService {
  constructor(
    private prisma: PrismaService,
  ) {}

  // Generate OTP (6 digits)
  private generateOtp(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  // Store OTP in DB and send email
  async generateAndSendOtp(email: string): Promise<void> {
    const otp = this.generateOtp();
    const expiration_time = addMinutes(new Date(), 1); // OTP expires in 1 minute
  
    // Store OTP in DB
    await this.prisma.otp.upsert({
      where: { email },
      update: { otp, expiration_time },
      create: { email, otp, expiration_time },
    });
  
    const htmlContent = `
      <html>
        <body>
          <p>Chúng tôi xin thông báo mã OTP của quý khách để xác nhận giao dịch chuyển tiền là: <strong>${otp}</strong>.</p>
          <p>Quý khách vui lòng nhập mã OTP này để hoàn tất giao dịch.</p>
          <p>Mã OTP này sẽ hết hạn sau 1 phút kể từ thời điểm nhận được. Vui lòng thực hiện giao dịch trong thời gian quy định.</p>
        </body>
      </html>
    `;
  
    await sendMail(email, 'Xác nhận giao dịch chuyển tiền', htmlContent);
  }

  // Verify OTP
  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const otpRecord = await this.prisma.otp.findUnique({
      where: { email },
    });

    if (!otpRecord) {
      return false; // OTP not found for this email
    }

    const isOtpValid = otpRecord.otp === otp && new Date() < otpRecord.expiration_time;
    return isOtpValid;
  }
}
