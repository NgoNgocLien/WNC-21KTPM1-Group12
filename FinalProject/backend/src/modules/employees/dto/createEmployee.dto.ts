import { Prisma } from '@prisma/client';
import {
  IsDefined,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateEmployeeDto implements Prisma.employeesCreateInput {
  @IsString()
  @IsDefined()
  username: string;

  @IsString()
  @IsDefined()
  password: string;

  @IsString()
  @IsDefined()
  fullname: string;

  @IsEmail()
  @IsString()
  @IsDefined()
  email: string;

  // @IsPhoneNumber('VI')
  @IsString()
  @IsDefined()
  phone: string;

  @IsString()
  @IsOptional()
  refresh_token: string;
}
