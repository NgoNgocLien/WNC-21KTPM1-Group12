import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

@ApiSchema({
  description: 'Thanh toán nợ',
})
export class PayDebtDto {
  @ApiProperty({
    description: 'ID giao dịch',
    example: 'transaction_123456789',
    required: true,
  })
  @IsString()
  @IsDefined()
  id_transaction: string;
}
