import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateDepositDto {
  @IsNotEmpty()
  @IsNumber()
  id_customer: number;

  @IsNotEmpty()
  @IsNumber()
  id_employee: number;

  @IsNotEmpty()
  deposit_amount: string | number;

  @IsOptional()
  @IsString()
  deposit_message: string;
}
