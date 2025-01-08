import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

import { CreateTransactionDto } from './dto/createTransaction.dto';
import { Prisma } from '@prisma/client';

import { FEE_AMOUNT, INTERNAL_BAND_ID } from 'src/common/utils/config';
import { BanksService } from '../banks/banks.service';
import { CustomersService } from '../customers/customers.service';
import { ExternalTransactionPayload } from '../auth/types/ExternalTransactionPayload';
import { time } from 'console';
import { ExternalTransactionResponse } from '../auth/types/ExternalTransactionResponse';
import { AuthService } from '../auth/auth.service';
import { timestamp } from 'rxjs';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly banksService: BanksService,
    private readonly customersService: CustomersService,
    private readonly authService: AuthService
  ) {}

  async findRecipientProfile(account_number: string, external_bank: any, encryptMethod: string){
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

      const transformedProfile = {
        account_number: profile.account_number,
        fullname: profile.customers.fullname
      }

      const public_key = (encryptMethod == "PGP") ? external_bank.pgp_public_key :  external_bank.rsa_public_key;

      const encryptedPayload = await this.authService.encryptData(JSON.stringify(transformedProfile), public_key, encryptMethod)

      return {
        message: "Profile fetched successfully",
        data: {
          encryptedPayload
        }
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
      const updatedAccount = await this.prisma.accounts.update({
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
        data: {
          ...transaction,
          type: "Sender",
          current_balance: updatedAccount.account_balance
        },
      };
    } catch (error) {
      throw new Error('Error creating transaction: ' + error.message);
    }
  }


  async sendExternalTransaction(createTransactionDto: CreateTransactionDto) {
    try {
     
      const external_bank = await this.banksService.getBankById(createTransactionDto.id_recipient_bank);


      const external_bank_base_url = external_bank.base_url + "/partner/transaction";

      const {sender_signature, recipient_signature } = await this.banksService.makeTransaction(createTransactionDto, external_bank, external_bank_base_url)

      const transaction = await this.prisma.transactions.create({
        data: {
          sender_account_number: createTransactionDto.sender_account_number,
          id_sender_bank: createTransactionDto.id_sender_bank,
          recipient_account_number: createTransactionDto.recipient_account_number,
          id_recipient_bank: createTransactionDto.id_recipient_bank,
          transaction_amount: new Prisma.Decimal(createTransactionDto.transaction_amount),
          transaction_message: createTransactionDto.transaction_message,
          fee_payment_method: createTransactionDto.fee_payment_method,
          fee_amount: FEE_AMOUNT,
          sender_signature, 
          recipient_signature,
          recipient_name: createTransactionDto.recipient_name,
        },
      });

      const updatedAccount = await this.prisma.accounts.update({
        where: {
          account_number: transaction.sender_account_number
        },
        data: {
          account_balance: {
            decrement: transaction.transaction_amount,
          }
        }
      })

      return {
        message: 'Transaction created successfully',
        data: {
          ...transaction,
          type: "Sender",
          current_balance: updatedAccount.account_balance
        },
      };
  } catch (error) {
    throw new Error('Error creating transaction: ' + error.message);
  }
  }

  async receiveExternalTransaction(sender_signature: string, payload: ExternalTransactionPayload, encryptMethod: string) {
    try {
      const bank = await this.banksService.getBankByInternalCode(payload.bank_code);

      console.log(payload.recipient_account_number)
      const customer = await this.customersService.findInternalProfile(payload.recipient_account_number)
      const recipient_name = customer.data;

      const transaction = await this.prisma.transactions.create({
        data: {
          sender_account_number: payload.sender_account_number,
          id_sender_bank: bank.id,
          recipient_account_number: payload.recipient_account_number,
          id_recipient_bank: INTERNAL_BAND_ID,
          transaction_amount: new Prisma.Decimal(payload.transaction_amount),
          transaction_message: payload.transaction_message,
          fee_amount: payload.fee_amount,
          fee_payment_method: payload.fee_payment_method,
          recipient_name: recipient_name,
        },
      });

      await this.prisma.accounts.update({
        where: {
          account_number: transaction.recipient_account_number
        },
        data: {
          account_balance: {
            increment: transaction.transaction_amount,
          }
        }
      })

      const responseData: ExternalTransactionResponse = await this.banksService.generateExternalResponseData(
        JSON.stringify({
          statusCode: 200
        }),
        bank,
        encryptMethod
      )

      await this.prisma.transactions.update({
        where: { id: transaction.id }, // Assuming transaction.id is the primary key
        data: { 
          sender_signature: sender_signature,
          recipient_signature: responseData.signature 
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

      const banks = await this.prisma.banks.findMany({
        select: {
          id: true,
          name: true,
          logo: true,
        }
      })

      return {
        message: 'Lấy thông tin giao dịch thành công',
        data: {
          transactions: transactionsWithBalance,
          banks: banks
        },
      };
    } catch (error) {
      throw new Error('Error fetching account transactions: ' + error.message);
    }
  }

  async findBankTransactions(){
    try{
      const bank = await this.prisma.banks.findMany({
        select: {
          id: true,
          name: true,
          logo: true,
        }
      })

      return {
        message: "Lấy thông tin banks thành công",
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

      const banks = await this.prisma.banks.findMany({
        select: {
          id: true,
          name: true,
          logo: true,
        }
      })

      return {
        message: 'Get account transactions successfully',
        data: {
          transactions: transactionsWithBalance,
          banks: banks
        },
      };
    } catch (error) {
      throw new Error('Error fetching account transactions: ' + error.message);
    }
  }

  async getExternalTransactions() {
    try {
      const transactions = await this.prisma.transactions.findMany({
        where: {
          OR: [
            {
              id_sender_bank: {
                not: 1, 
              },
            },
            {
              id_recipient_bank: {
                not: 1, 
              },
            },
          ],
        },
        orderBy: {
          transaction_time: 'desc',
        },
      });
  
      const transactionsWithType = transactions.map(transaction => ({
        ...transaction,
        type: transaction.id_sender_bank === 1 ? 'Sender' : 'Recipient'
      }));

      const banks = await this.prisma.banks.findMany({
        select: {
          id: true,
          name: true,
          logo: true,
        }
      })

      return {
        message: "Giao dịch của các ngân hàng khác đã được tìm thấy.",
        data: {
          transactions: transactionsWithType,
          banks: banks
        },
      };
    } catch (error) {
      throw new Error('Error fetching transactions: ' + error.message);
    }
  }
  
}
