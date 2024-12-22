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

  @IsNumber()
  @IsDefined()
  id_debtor: number;

  @IsNumber()
  @IsDefined()
  debt_amount: number;

  @IsString()
  @IsOptional()
  debt_message: string;

  @IsEnum(debt_status)
  @IsDefined()
  status: debt_status;

  @IsDateString()
  @IsDefined()
  created_at: string;
}
