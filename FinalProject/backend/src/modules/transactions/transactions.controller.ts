import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
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

  @HttpCode(HttpStatus.OK)
  @Get('account')
  findAccountTransactions(@Req() req: Request) {
    return this.transactionsService.getAccountTransactions(req.user['sub']);
  }

  // @Get('bank')
  // findBankTransactions() {
  //   return this.transactionsService.findBankTransactions(+id);
  // }

}
