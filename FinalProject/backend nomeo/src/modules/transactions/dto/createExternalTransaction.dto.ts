import {
  IsString,
  IsInt,
  IsOptional,
  MaxLength,
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
export class CreateExternalTransactionDto {
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
    example: 'A12345',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  recipient_account_number: string;

  @ApiProperty({
    description: 'ID ngân hàng người nhận',
    example: 2,
    required: true,
  })
  @IsInt()
  @IsDefined()
  id_recipient_bank: number;

  @ApiProperty({
    description: 'Số tiền giao dịch',
    example: '101000',
    required: true,
    minimum: 5000,
  })
  @Min(5000, { message: 'Transaction amount must be at least 5000 VND.' })
  @IsNumber()
  @IsDefined()
  transaction_amount: number | string;

  @ApiProperty({
    description: 'Nội dung giao dịch',
    example: 'Tiền thanh toán hóa đơn điện tháng 1',
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
    example: 'SENDER',
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
    description: 'Tên người nhận',
    example: 'Nguyen Muoi Ba',
    required: false,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100, { message: 'Recipient name must not exceed 100 characters.' })
  recipient_name: string;
}
