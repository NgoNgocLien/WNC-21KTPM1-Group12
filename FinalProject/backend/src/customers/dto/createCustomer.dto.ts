import { Prisma } from '@prisma/client';
import { IsEmail, IsOptional, IsPhoneNumber, IsString, Length } from 'class-validator';

export class CreateCustomerDto implements Prisma.customersCreateInput {
    @IsString()
    @Length(1, 50)
    username: string;
  
    @IsString()
    @Length(8, 100)
    password: string;
  
    @IsString()
    @Length(1, 100)
    fullname: string;
  
    @IsEmail()
    email: string;
  
    @IsPhoneNumber(null) // Assuming no specific region, you can provide a region code for validation
    phone: string;

    @IsOptional()
    refresh_token: string;
}
