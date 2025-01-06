import {
  IsDate,
  IsDateString,
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { debt_status } from '@prisma/client';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
  description: 'Tạo mới một nợ',
})
export class CreateDebtDto {
  @ApiProperty({
    description: 'ID người nhắc nợ',
    example: 1,
    required: true,
  })
  @IsNumber()
  @IsDefined()
  id_creditor: number;

  @ApiProperty({
    description: 'Số tài khoản người nhận nhắc nợ',
    example: 'ACC123456789',
    required: true,
  })
  @IsString()
  @IsDefined()
  debtor_account_number: string;

  @ApiProperty({
    description: 'Số tiền nợ',
    example: 100000,
    required: true,
  })
  @IsNumber()
  @IsDefined()
  debt_amount: number;

  @ApiProperty({
    description: 'Nội dung nhắc nợ',
    example: 'Nguyễn Văn A nhắc trả tiền nước',
    required: false,
  })
  @IsString()
  @IsOptional()
  debt_message: string;

  @IsEnum(debt_status)
  @IsOptional()
  status: debt_status;

  @IsDateString()
  @IsOptional()
  created_at: string;
}
