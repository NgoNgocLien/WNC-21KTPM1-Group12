import { IsDateString, IsDefined, IsNumber, IsString } from 'class-validator';

export class DeleteDebtDto {
  @IsNumber()
  @IsDefined()
  id_deleter: number;

  @IsString()
  @IsDefined()
  deletion_message: string;

  @IsDateString() // ISO 8601 string: 2021-08-24T00:00:00.000Z
  @IsDefined()
  deletion_time: Date;
}
