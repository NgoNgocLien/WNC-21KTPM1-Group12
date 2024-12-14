import { PartialType } from '@nestjs/swagger';
import { CreateTransactionDto } from './createTransaction.dto';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}
