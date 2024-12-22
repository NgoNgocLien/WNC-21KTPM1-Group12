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
import { DeleteDebtDto } from './dto/deleteDebt.dto';
import { PayDebtDto } from './dto/payDebt.dto';

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

  @Get('/outgoing')
  findOutgoing(@Req() req: Request) {
    return this.debtsService.findOutgoing(req.user['sub']);
  }

  @Get('/incoming')
  findIncoming(@Req() req: Request) {
    return this.debtsService.findIncoming(req.user['sub']);
  }

  @Get('/pending')
  findPending(@Req() req: Request) {
    return this.debtsService.findPending(req.user['sub']);
  }

  @Get('/completed')
  findCompleted(@Req() req: Request) {
    return this.debtsService.findCompleted(req.user['sub']);
  }

  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.debtsService.findOne(id);
  }

  @Post('/delete/:id')
  deleteDebt(
    @Param('id', ParseIntPipe) id: number,
    @Body() deleteDebtDto: DeleteDebtDto,
  ) {
    return this.debtsService.deleteDebt(id, deleteDebtDto);
  }

  // CALL AFTER AN TRANSACTION IS CREATED FOR DEBT
  @Post('/pay/:id')
  payDebt(
    @Param('id', ParseIntPipe) id: number,
    @Body() payDebtDto: PayDebtDto,
  ) {
    return this.debtsService.payDebt(id, payDebtDto);
  }
}
