import { Prisma } from '@prisma/client';
import { IsDefined, IsOptional, IsString } from 'class-validator';

export class CreateAdminDto implements Prisma.adminsCreateInput {
  @IsString()
  @IsDefined()
  username: string;

  @IsString()
  @IsDefined()
  password: string;

  @IsString()
  @IsOptional()
  refresh_token: string;
}
