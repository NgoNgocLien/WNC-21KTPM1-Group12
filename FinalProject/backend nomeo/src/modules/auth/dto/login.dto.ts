import { Role } from '../types/Role';
import { IsDefined, IsEnum, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsDefined()
  username: string;

  @IsString()
  @IsDefined()
  password: string;

  @IsString()
  @IsDefined()
  @IsEnum(Role)
  role: Role;

  @IsString()
  @IsDefined()
  fcm_token: string;
}
