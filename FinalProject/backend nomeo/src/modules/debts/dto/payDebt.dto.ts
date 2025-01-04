import { IsDefined, IsString } from 'class-validator';

export class PayDebtDto {
  @IsString()
  @IsDefined()
  id_transaction: string;
}
