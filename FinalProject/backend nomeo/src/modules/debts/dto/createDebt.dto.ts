import {
  IsDate,
  IsDateString,
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { debt_status } from '@prisma/client';

export class CreateDebtDto {
  @IsNumber()
  @IsDefined()
  id_creditor: number;

  @IsString()
  @IsDefined()
  debtor_account_number: string;

  @IsNumber()
  @IsDefined()
  debt_amount: number;

  @IsString()
  @IsOptional()
  debt_message: string;

  @IsEnum(debt_status)
  @IsOptional()
  status: debt_status;

  @IsDateString()
  @IsOptional()
  created_at: string;
}
