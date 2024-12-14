import { Prisma } from '@prisma/client';
import { IsEmail, IsPhoneNumber, IsString, Length } from 'class-validator';

export class CreateEmployeeDto implements Prisma.employeesCreateInput {
  username: string;
  password: string;
  fullname: string;
  email: string;
  phone: string;
  refresh_token: string;
}
