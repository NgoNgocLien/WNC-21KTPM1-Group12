import { IsString, IsInt, IsDecimal, IsOptional, IsDateString, MaxLength, MinLength, Matches, IsNotEmpty } from 'class-validator';
import { FeePayment } from '../types/FeePayment.type';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  // @MinLength(20, { message: 'Sender account number must be 20 characters long.' })
  // @MaxLength(20, { message: 'Sender account number must not exceed 20 characters.' })
  sender_account_number: string;

  @IsNotEmpty()
  @IsInt()
  id_sender_bank: number;

  @IsNotEmpty()
  @IsString()
  // @MinLength(20, { message: 'Recipient account number must be 20 characters long.' })
  // @MaxLength(20, { message: 'Recipient account number must not exceed 20 characters.' })
  recipient_account_number: string;

  @IsNotEmpty()
  @IsInt()
  id_recipient_bank: number;


  @IsNotEmpty()
  transaction_amount: string;

  @IsString()
  @MaxLength(255, { message: 'Transaction message is too long. Max 255 characters.' })
  transaction_message?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10, { message: 'Fee payment method must not exceed 10 characters.' })
  fee_payment_method?: FeePayment;

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Digital signature is too long.' })
  digital_signature?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Recipient name must not exceed 100 characters.' })
  recipient_name?: string;
}
