import { PartialType } from '@nestjs/swagger';
import { CreateCustomerDto } from './createCustomer.dto';
import { ApiSchema, ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { customer_status } from '@prisma/client';

@ApiSchema({
  description: 'Cập nhật thông tin khách hàng',
})
export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
  @ApiProperty({
    description: 'Trạng thái khách hàng',
    example: 'active',
    required: true,
  })
  @IsEnum(customer_status)
  @IsOptional()
  status?: customer_status;
}
