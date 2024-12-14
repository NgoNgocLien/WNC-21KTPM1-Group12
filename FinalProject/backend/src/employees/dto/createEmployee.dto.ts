import { Prisma } from '@prisma/client';

export class CreateEmployeeDto implements Prisma.employeesCreateInput {
  username: string;
  password: string;
  fullname: string;
  email: string;
  phone: string;
  refresh_token: string;
}
