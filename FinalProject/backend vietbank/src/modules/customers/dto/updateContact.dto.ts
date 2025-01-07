import { PartialType } from '@nestjs/mapped-types';
import { CreateContactDto } from './createContact.dto';
import { IsNumber } from 'class-validator';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
  description: 'Cập nhật thông tin liên hệ',
})
export class UpdateContactDto extends PartialType(CreateContactDto) {
  @ApiProperty({
    description: 'ID thông tin liên hệ',
    example: 1,
    required: true,
  })
  @IsNumber()
  id: number;
}
