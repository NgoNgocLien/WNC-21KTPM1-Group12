import { ApiHideProperty, ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsDefined, IsOptional, IsString } from 'class-validator';

@ApiSchema({
  description: 'Tạo admin',
})
export class CreateAdminDto implements Prisma.adminsCreateInput {
  @ApiProperty({
    description: 'Tên đăng nhập',
    example: 'admin20',
    required: true,
  })
  @IsString()
  @IsDefined()
  username: string;

  @ApiProperty({
    description: 'Mật khẩu',
    example: '123456',
    required: true,
  })
  @IsString()
  @IsDefined()
  password: string;

  @ApiHideProperty()
  @IsString()
  @IsOptional()
  refresh_token: string;
}
