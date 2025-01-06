import { PartialType } from '@nestjs/mapped-types';
import { CreateContactDto } from './createContact.dto';
import { IsDefined, IsNumber } from 'class-validator';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
  description: 'Xoá thông tin liên hệ',
})
export class DeleteContactDto {
  @ApiProperty({
    description: 'ID thông tin liên hệ',
    example: 1,
    required: true,
  })
  @IsNumber()
  @IsDefined()
  id: number;
}
