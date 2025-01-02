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
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/createTransaction.dto';
import { TransactionGuard } from '../auth/guards/transaction.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { CustomerInfoGuard } from '../auth/guards/customerInfo.guard';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Public()
  @UseGuards(CustomerInfoGuard)
  @Post('recipient_profile')
  findRecipientProfile(@Req() req: Request) {
    return this.transactionsService.findRecipientProfile(req.user["account_number"]);
  }

  @Post('internal')
  createInternalTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.createInternalTransaction(createTransactionDto);
  }

  // @Post('external/send')
  // sendExternalTransaction(@Body() createTransactionDto: CreateTransactionDto) {
  //   return this.transactionsService.sendExternalTransaction(createTransactionDto);
  // }

  @Public()
  @UseGuards(TransactionGuard)
  @Post('external/receive')
  receiveExternalTransaction(@Req() req: Request) {
    return this.transactionsService.receiveExternalTransaction(
      req.user["bank_code"], 
      req.user["signature"], 
      req.user["payload"] 
    );
  }


  @Get('account')
  findAccountTransactions(@Req() req: Request) {
    return this.transactionsService.getAccountTransactions(req.user['sub']);
  }

  @Get('account/:account_number')
  findCustomerTransactions(@Param('account_number') account_number: string) {
    return this.transactionsService.getCustomerTransactions(account_number);
  }

  @Get('bank/:id_bank')
  findBankTransactions(@Param('id_bank') id_bank: number) {
    return this.transactionsService.findBankTransactions(id_bank);
  }

}
