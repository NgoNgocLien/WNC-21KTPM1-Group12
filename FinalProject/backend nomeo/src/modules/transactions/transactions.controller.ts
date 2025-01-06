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
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Transactions')
@ApiBearerAuth('access-token')
@ApiResponse({
  status: HttpStatus.BAD_REQUEST,
  description: 'Yêu cầu không hợp lệ',
})
@ApiResponse({
  status: HttpStatus.UNAUTHORIZED,
  description: 'Không có quyền truy cập',
})
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tìm kiếm thông tin người nhận thành công',
  })
  @Public()
  @UseGuards(CustomerInfoGuard)
  @HttpCode(HttpStatus.OK)
  @Post('recipient_profile')
  findRecipientProfile(@Req() req: Request) {
    return this.transactionsService.findRecipientProfile(
      req.user['account_number'],
    );
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Tạo giao dịch nội bộ thành công',
  })
  @Post('internal')
  createInternalTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.transactionsService.createInternalTransaction(
      createTransactionDto,
    );
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Tạo giao dịch với ngân hàng khác thành công',
  })
  @Post('external/send')
  sendExternalTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.sendExternalTransaction(
      createTransactionDto,
    );
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Nhận giao dịch từ ngân hàng khác thành công',
  })
  @Public()
  @UseGuards(TransactionGuard)
  @Post('external/receive')
  receiveExternalTransaction(@Req() req: Request) {
    return this.transactionsService.receiveExternalTransaction(
      req.user['signature'],
      req.user['payload'],
    );
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy tất cả giao dịch với ngân hàng khác thành công',
  })
  @Get('external')
  findExternalTransactions() {
    return this.transactionsService.getExternalTransactions();
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy tất cả giao dịch của khách hàng thành công',
  })
  @Get('account')
  findAccountTransactions(@Req() req: Request) {
    return this.transactionsService.getAccountTransactions(req.user['sub']);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Lấy tất cả giao dịch theo số tài khoản của khách hàng thành công',
  })
  @ApiParam({
    name: 'account_number',
    description: 'Số tài khoản của khách hàng',
    example: 'ACC1000000001',
    required: true,
  })
  @Get('account/:account_number')
  findCustomerTransactions(@Param('account_number') account_number: string) {
    return this.transactionsService.getCustomerTransactions(account_number);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy tất cả giao dịch của ngân hàng thành công',
  })
  @Get('bank/:id_bank')
  findBankTransactions(@Param('id_bank') id_bank: number) {
    return this.transactionsService.findBankTransactions(id_bank);
  }
}
