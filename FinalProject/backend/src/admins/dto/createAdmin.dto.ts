import { Prisma } from '@prisma/client';

export class CreateAdminDto implements Prisma.adminsCreateInput {
  username: string;
  password: string;
  refresh_token: string;
}
