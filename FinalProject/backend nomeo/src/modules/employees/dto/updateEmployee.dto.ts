import { PartialType, ApiProperty, ApiSchema } from '@nestjs/swagger';
import { CreateEmployeeDto } from './createEmployee.dto';
import { employee_status } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

@ApiSchema({
  description: 'Cập nhật nhân viên',
})
export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
  @ApiProperty({
    description: 'Trạng thái',
    example: 'ACTIVE',
    enum: employee_status,
    required: false,
  })
  @IsEnum(employee_status)
  @IsOptional()
  status?: employee_status;

  // @ApiProperty({
  //   description: 'Refresh token',
  //   example: 'refresh_token',
  //   required: false,
  // })
  @IsString()
  @IsOptional()
  refresh_token?: string;
}
