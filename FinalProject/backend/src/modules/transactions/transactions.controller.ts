import {
  Controller,
  Get,
  Post,
  Body
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/createTransaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}


  @Post('internal')
  createInternalTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.createInternalTransaction(createTransactionDto);
  }

  @Post('external')
  createExternalTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.createExternalTransaction(createTransactionDto);
  }

  // @Get('account')
  // findAccountTransactions() {
  //   return this.transactionsService.findAccountTransactions();
  // }

  // @Get('bank')
  // findBankTransactions() {
  //   return this.transactionsService.findBankTransactions(+id);
  // }

}
