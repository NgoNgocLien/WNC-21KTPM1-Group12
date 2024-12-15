import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { DebtsService } from './debts.service';
import { CreateDebtDto } from './dto/createDebt.dto';
import { UpdateDebtDto } from './dto/updateDebt.dto';

@Controller('debts')
export class DebtsController {
  constructor(private readonly debtsService: DebtsService) {}

  @Post()
  create(@Body() createDebtDto: CreateDebtDto) {
    return this.debtsService.create(createDebtDto);
  }

  @Get()
  findAll() {
    return this.debtsService.findAll();
  }

  @Get('/outgoing/:id_customer')
  findOutgoing(@Param('id_customer', ParseIntPipe) id_customer: number) {
    return this.debtsService.findOutgoing(id_customer);
  }

  @Get('/incoming/:id_customer')
  findIncoming(@Param('id_customer', ParseIntPipe) id_customer: number) {
    return this.debtsService.findIncoming(id_customer);
  }

  @Patch('/delete/:id')
  deleteDebt(@Param('id', ParseIntPipe) id: number) {
    return this.debtsService.deleteDebt(id);
  }

  // CALL AFTER AN TRANSACTION IS CREATED FOR DEBT
  @Post('/pay/:id')
  payDebt(
    @Param('id', ParseIntPipe) id: number,
    @Body() transactionData: { id_transaction: number },
  ) {
    return this.debtsService.payDebt(id, transactionData);
  }
}
