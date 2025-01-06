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
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiHeaders,
  ApiParam,
} from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('debts')
export class DebtsController {
  constructor(private readonly debtsService: DebtsService) {}

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

  @ApiHeaders([
    {
      name: 'Authorization',
      description: 'Bearer token',
    },
  ])
  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.debtsService.findOne(id);
  }

  @Post()
  create(@Body() createDebtDto: CreateDebtDto) {
    return this.debtsService.create(createDebtDto);
  }

  @Post('/cancel/:id')
  cancelDebt(
    @Param('id', ParseIntPipe) id: number,
    @Body() deleteDebtDto: DeleteDebtDto,
  ) {
    return this.debtsService.cancelDebt(id, deleteDebtDto);
  }

  @Post('/decline/:id')
  declineDebt(
    @Param('id', ParseIntPipe) id: number,
    @Body() deleteDebtDto: DeleteDebtDto,
  ) {
    return this.debtsService.declineDebt(id, deleteDebtDto);
  }

  @Post('/pay/:id')
  payDebt(
    @Param('id', ParseIntPipe) id: number,
    @Body() payDebtDto: PayDebtDto,
  ) {
    return this.debtsService.payDebt(id, payDebtDto);
  }
}
