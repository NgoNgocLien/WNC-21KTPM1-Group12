import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Param,
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

  @Get('account')
  findAccountTransactions(@Req() req: Request) {
    return this.transactionsService.getAccountTransactions(req.user['sub']);
  }

  @Get('bank/:id_bank')
  findBankTransactions(@Param('id_bank') id_bank: number) {
    return this.transactionsService.findBankTransactions(id_bank);
  }

}
