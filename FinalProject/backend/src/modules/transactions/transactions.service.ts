import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateTransactionDto } from './dto/createTransaction.dto';
import { plainToClass } from 'class-transformer';
import { Prisma } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async createInternalTransaction(createTransactionDto: CreateTransactionDto) {
    const dtoInstance = plainToClass(CreateTransactionDto, createTransactionDto);

    return this.prisma.transactions.create({
      data: {
        sender_account_number: createTransactionDto.sender_account_number,
        id_sender_bank: createTransactionDto.id_sender_bank,
        recipient_account_number: createTransactionDto.recipient_account_number,
        id_recipient_bank: createTransactionDto.id_recipient_bank,
        transaction_amount: new Prisma.Decimal(createTransactionDto.transaction_amount),
        transaction_message: createTransactionDto.transaction_message,
        fee_payment_method: createTransactionDto.fee_payment_method,
        transaction_time: new Date(createTransactionDto.transaction_time),
        recipient_name: createTransactionDto.recipient_name,
      },
    });

  }

  async createExternalTransaction(createTransactionDto: CreateTransactionDto) {
    return this.prisma.transactions.create({
      data: {
        sender_account_number: createTransactionDto.sender_account_number,
        id_sender_bank: createTransactionDto.id_sender_bank,
        recipient_account_number: createTransactionDto.recipient_account_number,
        id_recipient_bank: createTransactionDto.id_recipient_bank,
        transaction_amount: new Prisma.Decimal(createTransactionDto.transaction_amount),
        transaction_message: createTransactionDto.transaction_message,
        fee_payment_method: createTransactionDto.fee_payment_method,
        transaction_time: new Date(createTransactionDto.transaction_time),
        digital_signature: createTransactionDto.digital_signature,
        recipient_name: createTransactionDto.recipient_name,
      },
    });
  }
}
