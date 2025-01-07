import {
  IsString,
  IsInt,
  IsDecimal,
  IsOptional,
  IsDateString,
  MaxLength,
  MinLength,
  Matches,
  IsNotEmpty,
  IsDefined,
  IsNumber,
  IsEnum,
  Min,
} from 'class-validator';
import { FeePayment } from '../types/FeePayment.type';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
  description: 'Tạo giao dịch mới',
})
export class CreateTransactionDto {
  @ApiProperty({
    description: 'Số tài khoản người gửi',
    example: 'ACC123456789',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  sender_account_number: string;

  @ApiProperty({
    description: 'ID ngân hàng người gửi',
    example: 1,
    required: true,
  })
  @IsInt()
  @IsDefined()
  id_sender_bank: number;

  @ApiProperty({
    description: 'Số tài khoản người nhận',
    example: 'ACC100000001',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  recipient_account_number: string;

  @ApiProperty({
    description: 'ID ngân hàng người nhận',
    example: 1,
    required: true,
  })
  @IsInt()
  @IsDefined()
  id_recipient_bank: number;

  @ApiProperty({
    description: 'Số tiền giao dịch',
    example: '100000',
    required: true,
    minimum: 5000,
  })
  @Min(5000, { message: 'Transaction amount must be at least 5000 VND.' })
  @IsNumber()
  @IsDefined()
  transaction_amount: number;

  @ApiProperty({
    description: 'Nội dung giao dịch',
    example: 'Tiền thanh toán hóa đơn điện tháng 12',
    required: true,
  })
  @MaxLength(255, {
    message: 'Transaction message is too long. Max 255 characters.',
  })
  @IsString()
  @IsOptional()
  transaction_message?: string;

  @ApiProperty({
    description: 'Phương thức thanh toán phí',
    example: '2021-08-24T00:00:00.000Z',
    required: true,
    enum: FeePayment,
  })
  @IsEnum(FeePayment, {
    message: 'Invalid fee payment method.',
  })
  @IsString()
  @IsDefined()
  fee_payment_method?: FeePayment;

  @ApiProperty({
    description: 'Phí giao dịch',
    example: '1000',
    required: false,
    minimum: 0,
  })
  @IsOptional()
  fee_amount: string;

  @ApiProperty({
    description: 'Tên người nhận',
    example: 'Nguyễn Văn A',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Recipient name must not exceed 100 characters.' })
  recipient_name?: string;
}
