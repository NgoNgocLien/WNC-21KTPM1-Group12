import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

@ApiSchema({
  description: 'Xác thực captcha',
})
export class VerifyCaptchaDto {
  @ApiProperty({
    description: 'Token captcha',
    example: 'captcha_token',
    required: true,
  })
  @IsString()
  @IsDefined()
  token: string;
}
