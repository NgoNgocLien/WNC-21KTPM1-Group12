import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

import { CreateTransactionDto } from './dto/createTransaction.dto';
import { plainToClass } from 'class-transformer';
import { Prisma } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async createInternalTransaction(createTransactionDto: CreateTransactionDto) {
    try{
      const transaction = await this.prisma.transactions.create({
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

      return {
        message: 'Transaction created successfully',
        data: transaction,
      };
    } catch (error) {
      throw new Error('Error creating transaction: ' + error.message);
    }
  }

  async createExternalTransaction(createTransactionDto: CreateTransactionDto) {
    try {
    const transaction = await this.prisma.transactions.create({
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
    return {
      message: 'Transaction created successfully',
      data: transaction,
    };
  } catch (error) {
    throw new Error('Error creating transaction: ' + error.message);
  }
  }
}
