import { PartialType } from '@nestjs/mapped-types';
import { CreateContactDto } from './createContact.dto';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
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
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    description: 'Tên gợi nhớ mới',
    example: 'Văn A',
    required: true,
  })
  nickname: string;
}
