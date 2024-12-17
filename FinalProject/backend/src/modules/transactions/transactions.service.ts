import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getAccountTransactions(id_customer: number) {
    try {
      const account = await this.prisma.accounts.findUnique({
        where: { id: id_customer }
      });
  
      if (!account) throw new NotFoundException(`Customer with id ${id_customer} not found`);
  
      const { account_number, account_balance } = account;
      let currentBalance = account_balance.toNumber();

      // Lấy danh sách giao dịch chuyển khoản (Sender)
      const sentTransactions = await this.prisma.transactions.findMany({
        where: { sender_account_number: account_number }
      });
  
      const sentTransactionsWithType = sentTransactions.map((t) => ({
        ...t,
        type: 'Sender',
        transaction_amount: t.transaction_amount.toNumber(),
        current_balance: 0
      }));
      
      // Lấy danh sách giao dịch nhận tiền (Recipient)
      const receivedTransactions = await this.prisma.transactions.findMany({
        where: { recipient_account_number: account_number }
      });
  
      const receivedTransactionsWithType = receivedTransactions.map((t) => ({
        ...t,
        type: 'Recipient',
        transaction_amount: t.transaction_amount.toNumber(),
        current_balance: 0
      }));
      
  
      // Lọc giao dịch thanh toán nhắc nợ từ bảng debt_payments
      const debtPayments = await this.prisma.debt_payments.findMany({
        where: { id_transaction: { in: [...sentTransactions.map((t) => t.id), ...receivedTransactions.map((t) => t.id)] } },
      });

      const debtTransactionIds = debtPayments.map((d) => d.id_transaction);

      // Loại bỏ các giao dịch thanh toán nhắc nợ khỏi Recipient
      const filteredReceivedTransactions = receivedTransactionsWithType.filter(
        (t) => !debtTransactionIds.includes(t.id),
      );
      
      // Loại bỏ các giao dịch thanh toán nhắc nợ khỏi Sender
      const filteredSentTransactions = sentTransactionsWithType.filter(
        (t) => !debtTransactionIds.includes(t.id),
      );

      // Danh sách các giao dịch thanh toán nhắc nợ
      const debtTransactions = [
        ...sentTransactionsWithType,
        ...receivedTransactionsWithType,
      ].filter((t) => debtTransactionIds.includes(t.id))
       .map((t) => {
        const isSender = t.sender_account_number === account_number;
        return {
          ...t,
          type: isSender ? 'Sender (Debt)' : 'Recipient (Debt)',
        }; 
      });
  

      // Lấy các giao dịch nạp tiền từ bảng deposits
      const deposits = await this.prisma.deposits.findMany({
        where: { id_customer }
      });
  
      const depositsWithType = deposits.map((d) => ({
        ...d,
        type: 'Recipient',
        transaction_time: d.deposit_time,
        transaction_amount: d.deposit_amount.toNumber(),
        current_balance: 0
      }));
  
      // // Gộp các giao dịch Recipient (bao gồm nhận tiền và nạp tiền)
      const allReceivedTransactions = [
        ...filteredReceivedTransactions,
        ...depositsWithType,
      ];
      
      const allTransactions = [
        ...filteredSentTransactions,
        ...allReceivedTransactions,
        ...debtTransactions
      ].sort((a, b) => (b.transaction_time > a.transaction_time ? 1 : -1));

      const transactionsWithBalance = [];

// Duyệt qua tất cả giao dịch từ cuối lên đầu
for (let i = allTransactions.length - 1; i >= 0; i--) {
  const currentTransaction = allTransactions[i];

  // Nếu là giao dịch đầu tiên (cuối cùng trong mảng), gán current_balance là 0 cộng với amount
  if (i === allTransactions.length - 1) {
    currentTransaction.current_balance += currentTransaction.transaction_amount;
  } else {
    // Cập nhật current_balance cho giao dịch hiện tại dựa vào current_balance của giao dịch trước đó
    const previousTransaction = allTransactions[i + 1];
    currentTransaction.current_balance = previousTransaction.current_balance;

    // Cập nhật current_balance của giao dịch hiện tại
    if (currentTransaction.type === 'Sender' || currentTransaction.type === 'Sender (Debt)') {
      currentTransaction.current_balance -= currentTransaction.transaction_amount;
    } else if (currentTransaction.type === 'Recipient' || currentTransaction.type === 'Recipient (Debt)') {
      currentTransaction.current_balance += currentTransaction.transaction_amount;
    }
  }

  // Thêm giao dịch đã cập nhật vào mảng kết quả
  transactionsWithBalance.unshift(currentTransaction);
}

return {
  transactions: transactionsWithBalance,
};

      // Trả về kết quả sắp xếp từ mới đến cũ
      return {
        transactions: transactionsWithBalance,
      };
    } catch (error) {
      throw new Error('Error fetching account transactions: ' + error.message);
    }
  }
}
