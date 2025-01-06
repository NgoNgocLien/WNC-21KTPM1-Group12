import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@ApiSchema({
  description: 'Lưu thông tin liên hệ',
})
export class CreateContactDto {
  @ApiProperty({
    description: 'ID khách hàng muốn lưu',
    example: 2,
    required: true,
  })
  @IsNumber()
  id_customer: number;

  @ApiProperty({
    description: 'Số tài khoản liên hệ',
    example: 'ACC100000001',
    required: true,
  })
  @IsString()
  contact_account_number: string;

  @ApiProperty({
    description: 'ID ngân hàng liên hệ',
    example: 1,
    required: true,
  })
  @IsNumber()
  id_bank: number;

  @ApiProperty({
    description: 'Biệt danh',
    example: 'Nguyễn Văn A',
    required: false,
  })
  @IsString()
  nickname: string;

  @ApiProperty({
    description: 'Họ và tên',
    example: 'Nguyễn Văn A',
    required: true,
  })
  @IsString()
  contact_fullname: string;
}
