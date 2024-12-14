import { PartialType } from '@nestjs/swagger';
import { CreateDebtDto } from './createDebt.dto';

export class UpdateDebtDto extends PartialType(CreateDebtDto) {}
