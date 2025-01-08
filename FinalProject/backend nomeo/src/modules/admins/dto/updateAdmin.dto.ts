import { ApiProperty, ApiSchema, PartialType } from '@nestjs/swagger';
import { CreateAdminDto } from './createAdmin.dto';
import { IsOptional, IsString } from 'class-validator';

@ApiSchema({
  description: 'Cập nhật admin',
})
export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  // @ApiProperty({
  //   description: 'Refresh token',
  //   example: 'refresh_token',
  //   required: false,
  // })
  @IsString()
  @IsOptional()
  refresh_token: string;
}
