import { PartialType } from '@nestjs/swagger';
import { CreateCustomerDto } from './createCustomer.dto';
import { ApiSchema } from '@nestjs/swagger';

@ApiSchema({
  description: 'Cập nhật thông tin khách hàng',
})
export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}
