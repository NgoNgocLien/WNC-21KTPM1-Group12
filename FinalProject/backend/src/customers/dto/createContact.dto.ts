import { IsNumber, IsString } from 'class-validator';

export class CreateContactDto  {
    @IsNumber()
    id_customer: number;
  
    @IsString()
    contact_account_number: string;
  
    @IsNumber()
    id_bank: number;
  
    @IsString()
    nickname: string;
}
