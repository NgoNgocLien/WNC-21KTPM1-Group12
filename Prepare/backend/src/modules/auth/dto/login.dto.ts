import { IsDefined, IsEnum, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsDefined()
  username: string;

  @IsString()
  @IsDefined()
  password: string;
}
