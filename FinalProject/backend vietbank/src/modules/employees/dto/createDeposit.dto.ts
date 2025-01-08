import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

@ApiSchema({
  description: 'Nạp tiền',
})
export class CreateDepositDto {
  @ApiProperty({
    description: 'ID khách hàng',
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  id_customer: number;

  @ApiProperty({
    description: 'ID nhân viên',
    example: 2,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  id_employee: number;

  @ApiProperty({
    description: 'Số tiền nhân viên cần nạp',
    example: 200000,
    required: true,
  })
  @IsNotEmpty()
  deposit_amount: string | number;

  @ApiProperty({
    description: 'Nội dung nạp tiền',
    example: 'Nạp tiền',
    required: false,
  })
  @IsOptional()
  @IsString()
  deposit_message: string;
}
