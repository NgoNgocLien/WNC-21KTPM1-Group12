import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

import { CreateTransactionDto } from './dto/createTransaction.dto';
import { Prisma } from '@prisma/client';
import * as crypto from 'crypto';

import { INTERNAL_BAND_ID } from 'src/common/utils/config';
import { BanksService } from '../banks/banks.service';
import { CustomersService } from '../customers/customers.service';
import { ExternalTransactionPayload } from '../auth/types/ExternalTransactionPayload';
import { time } from 'console';
import { generateResponseData } from 'src/common/utils/encryptTransaction';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly banksService: BanksService,
    private readonly customersService: CustomersService
  ) {}

  async findRecipientProfile(account_number: string){
    try{
      const profile = await this.prisma.accounts.findUnique({
        where:{
          account_number: account_number,
        },
        select:{
          account_number: true,
          customers: {
            select:{
              fullname: true
            }
          }
        }
      })

      const data = {
        account_number: profile.account_number,
        fullname: profile.customers.fullname
      }

      return {
        message: "Profile fetched successfully",
        data: data
      }
    } catch(error){
      throw new Error('Error fetching profile: ' + error.message);
    }
  }

  async createInternalTransaction(createTransactionDto: CreateTransactionDto) {
    try{
      const senderExists = await this.prisma.accounts.findUnique({
        where: { account_number: createTransactionDto.sender_account_number },
      });
      if (!senderExists) {
        throw new NotFoundException(`Sender not found`);
      }

      const recipientExists = await this.prisma.accounts.findUnique({
        where: { account_number: createTransactionDto.recipient_account_number },
      });
      if (!recipientExists) {
        throw new NotFoundException(`Sender not found`);
      }

      const transaction_amount = new Prisma.Decimal(createTransactionDto.transaction_amount)
      await this.prisma.accounts.update({
        where: { account_number: senderExists.account_number },
        data: {
          account_balance: {
            decrement: transaction_amount,
          },
        },
      });

      await this.prisma.accounts.update({
        where: { account_number: recipientExists.account_number },
        data: {
          account_balance: {
            increment: transaction_amount,
          },
        },
      });

      const transaction = await this.prisma.transactions.create({
        data: {
          sender_account_number: senderExists.account_number,
          id_sender_bank: INTERNAL_BAND_ID,
          recipient_account_number: recipientExists.account_number,
          id_recipient_bank: INTERNAL_BAND_ID,
          transaction_amount: transaction_amount,
          transaction_message: createTransactionDto.transaction_message,
          fee_payment_method: createTransactionDto.fee_payment_method,
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


  // async createExternalTransaction(createTransactionDto: CreateTransactionDto) {
  //   try {
  //   const transaction = await this.prisma.transactions.create({
  //     data: {
  //       sender_account_number: createTransactionDto.sender_account_number,
  //       id_sender_bank: createTransactionDto.id_sender_bank,
  //       recipient_account_number: createTransactionDto.recipient_account_number,
  //       id_recipient_bank: createTransactionDto.id_recipient_bank,
  //       transaction_amount: new Prisma.Decimal(createTransactionDto.transaction_amount),
  //       transaction_message: createTransactionDto.transaction_message,
  //       fee_payment_method: createTransactionDto.fee_payment_method,
  //       digital_signature: createTransactionDto.digital_signature,
  //       recipient_name: createTransactionDto.recipient_name,
  //     },
  //   });
  //   return {
  //     message: 'Transaction created successfully',
  //     data: transaction,
  //   };
  // } catch (error) {
  //   throw new Error('Error creating transaction: ' + error.message);
  // }
  // }

  async receiveExternalTransaction(bank_code: string, sender_signature: string, payload: ExternalTransactionPayload) {
    try {
      const bank = await this.banksService.getBank(bank_code);

      console.log(payload.recipient_account_number);
      const customer = await this.customersService.findInternalProfile(payload.recipient_account_number)
      const recipient_name = customer.data.customers.fullname;

      const transaction = await this.prisma.transactions.create({
        data: {
          sender_account_number: payload.sender_account_number,
          id_sender_bank: bank.id,
          recipient_account_number: payload.recipient_account_number,
          id_recipient_bank: INTERNAL_BAND_ID,
          transaction_amount: new Prisma.Decimal(payload.transaction_amount),
          transaction_message: payload.transaction_message,
          fee_payment_method: payload.fee_payment_method,
          recipient_name: recipient_name,
        },
      });

      const responseData = generateResponseData(
        JSON.stringify(transaction),
        bank.public_key,
        bank.secret_key
      )

      await this.prisma.transactions.update({
        where: { id: transaction.id }, // Assuming transaction.id is the primary key
        data: { 
          sender_signature: sender_signature,
          recipient_signature: responseData.recipient_signature 
        },
      });

      return {
        message: 'Transaction created successfully',
        data: responseData,
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
  
      const { account_number } = account;

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
        type: 'Deposit',
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

      for (let i = allTransactions.length - 1; i >= 0; i--) {
        const currentTransaction = allTransactions[i];

        if (i === allTransactions.length - 1) {
          currentTransaction.current_balance += currentTransaction.transaction_amount;
        } else {
          const previousTransaction = allTransactions[i + 1];
          currentTransaction.current_balance = previousTransaction.current_balance;

          if (currentTransaction.type === 'Sender' || currentTransaction.type === 'Sender (Debt)') {
            currentTransaction.current_balance -= currentTransaction.transaction_amount;
          } else if (currentTransaction.type === 'Deposit' || currentTransaction.type === 'Recipient' || currentTransaction.type === 'Recipient (Debt)') {
            currentTransaction.current_balance += currentTransaction.transaction_amount;
          }
        }

        transactionsWithBalance.unshift(currentTransaction);
      }

      return {
        message: 'Get account transactions successfully',
        data: {
          transactions: transactionsWithBalance,
        },
      };
    } catch (error) {
      throw new Error('Error fetching account transactions: ' + error.message);
    }
  }

  async findBankTransactions(id_bank: number){
    try{
      const bank = await this.prisma.banks.findUnique({
        where:{
          id: Number(id_bank),
        }
      })

      return {
        message: "Bank fetched successfully",
        data: bank
      }
    } catch(error){
      throw new Error('Error fetching profile: ' + error.message);
    }
  }

  async getCustomerTransactions(account_number: string) {
    try {
      const account = await this.prisma.accounts.findUnique({
        where: { account_number }
      });

      if (!account) throw new NotFoundException(`Số tài khoản không tồn tại`);

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
        where: { id_customer: account.id_customer }
      });
  
      const depositsWithType = deposits.map((d) => ({
        ...d,
        type: 'Deposit',
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

      for (let i = allTransactions.length - 1; i >= 0; i--) {
        const currentTransaction = allTransactions[i];

        if (i === allTransactions.length - 1) {
          currentTransaction.current_balance += currentTransaction.transaction_amount;
        } else {
          const previousTransaction = allTransactions[i + 1];
          currentTransaction.current_balance = previousTransaction.current_balance;

          if (currentTransaction.type === 'Sender' || currentTransaction.type === 'Sender (Debt)') {
            currentTransaction.current_balance -= currentTransaction.transaction_amount;
          } else if (currentTransaction.type === 'Deposit' || currentTransaction.type === 'Recipient' || currentTransaction.type === 'Recipient (Debt)') {
            currentTransaction.current_balance += currentTransaction.transaction_amount;
          }
        }

        transactionsWithBalance.unshift(currentTransaction);
      }

      return {
        message: 'Get account transactions successfully',
        data: {
          transactions: transactionsWithBalance,
        },
      };
    } catch (error) {
      throw new Error('Error fetching account transactions: ' + error.message);
    }
  }
}
