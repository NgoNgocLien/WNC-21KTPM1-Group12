import { IsDefined, IsEnum, IsString } from 'class-validator';

export class SignupDto {
  @IsString()
  @IsDefined()
  username: string;

  @IsString()
  @IsDefined()
  password: string;
}
