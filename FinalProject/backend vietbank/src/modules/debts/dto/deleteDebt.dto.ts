import { ApiHideProperty, ApiProperty, ApiSchema } from '@nestjs/swagger';
import {
  IsDateString,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

@ApiSchema({
  description: 'Xóa nhắc nợ',
})
export class DeleteDebtDto {
  @ApiProperty({
    description: 'ID người xóa nhắc nợ',
    example: 1,
    required: true,
  })
  @IsNumber()
  @IsDefined()
  id_deleter: number;

  @ApiProperty({
    description: 'Nội dung xóa nhắc nợ',
    example: 'Người nợ đã trả tiền mặt',
    required: false,
  })
  @IsString()
  @IsOptional()
  deletion_message: string;

  @ApiHideProperty()
  @IsDateString() // ISO 8601 string: 2021-08-24T00:00:00.000Z
  @IsOptional()
  deletion_time: Date;
}
