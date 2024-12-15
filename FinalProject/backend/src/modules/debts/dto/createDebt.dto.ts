import {
  IsDate,
  IsDateString,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { DebtStatus } from '../types/DebtStatus.type';

export class CreateDebtDto {
  @IsNumber()
  @IsDefined()
  id_creditor: number;

  @IsNumber()
  @IsDefined()
  id_debtor: number;

  @IsNumber()
  @IsDefined()
  debt_amount: number;

  @IsString()
  @IsOptional()
  debt_message: string;

  @IsString()
  @IsDefined()
  status: DebtStatus;

  @IsDateString()
  @IsDefined()
  created_at: string;
}
