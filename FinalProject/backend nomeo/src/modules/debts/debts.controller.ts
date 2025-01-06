import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { DebtsService } from './debts.service';
import { CreateDebtDto } from './dto/createDebt.dto';
import { DeleteDebtDto } from './dto/deleteDebt.dto';
import { PayDebtDto } from './dto/payDebt.dto';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Debts')
@ApiBearerAuth('access-token')
@ApiResponse({
  status: HttpStatus.BAD_REQUEST,
  description: 'Yêu cầu không hợp lệ',
})
@ApiResponse({
  status: HttpStatus.UNAUTHORIZED,
  description: 'Không có quyền truy cập',
})
@Controller('debts')
export class DebtsController {
  constructor(private readonly debtsService: DebtsService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Tạo nhắc nợ mới thành công',
  })
  @Post()
  create(@Body() createDebtDto: CreateDebtDto) {
    return this.debtsService.create(createDebtDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy tất cả nhắc nợ thành công',
  })
  @Get()
  findAll() {
    return this.debtsService.findAll();
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy tất cả nhắc nợ đã tạo thành công',
  })
  @Get('/outgoing')
  findOutgoing(@Req() req: Request) {
    return this.debtsService.findOutgoing(req.user['sub']);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy tất cả nhắc nợ đã nhận từ người khác thành công',
  })
  @Get('/incoming')
  findIncoming(@Req() req: Request) {
    return this.debtsService.findIncoming(req.user['sub']);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy tất cả nhắc nợ đang chờ xử lý thành công',
  })
  @Get('/pending')
  findPending(@Req() req: Request) {
    return this.debtsService.findPending(req.user['sub']);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy tất cả nhắc nợ đã hoàn thành thành công',
  })
  @Get('/completed')
  findCompleted(@Req() req: Request) {
    return this.debtsService.findCompleted(req.user['sub']);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy thông tin nhắc nợ theo ID thành công',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID của nhắc nợ',
    required: true,
    example: 1,
  })
  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.debtsService.findOne(id);
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Xóa nhắc nợ thành công',
  })
  @Post('/cancel/:id')
  cancelDebt(
    @Param('id', ParseIntPipe) id: number,
    @Body() deleteDebtDto: DeleteDebtDto,
  ) {
    return this.debtsService.cancelDebt(id, deleteDebtDto);
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Từ chối nhắc nợ thành công',
  })
  @Post('/decline/:id')
  declineDebt(
    @Param('id', ParseIntPipe) id: number,
    @Body() deleteDebtDto: DeleteDebtDto,
  ) {
    return this.debtsService.declineDebt(id, deleteDebtDto);
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Thanh toán nợ thành công',
  })
  @Post('/pay/:id')
  payDebt(
    @Param('id', ParseIntPipe) id: number,
    @Body() payDebtDto: PayDebtDto,
  ) {
    return this.debtsService.payDebt(id, payDebtDto);
  }
}
