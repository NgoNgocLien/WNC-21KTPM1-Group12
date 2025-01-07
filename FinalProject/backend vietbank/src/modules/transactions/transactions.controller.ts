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
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

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
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Lỗi server',
})
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy thông tin khách hàng ngân hàng khác thành công.',
    schema: {
      type: 'object',
      properties: {
        encryptedPayload: {
          type: 'string',
          description: 'Thông tin khách hàng đã được mã hóa mà được giải mã bằng RSA/PGP private key tương ứng của ngân hàng liên kết.',
          example: 'RSA(fullname, account_number)',
        },
      },
    },
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        encryptMethod: {
          type: 'string',
          description: 'Cơ chế mã hóa',
          example: 'RSA or PGP',
        },
        encryptedPayload: {
          type: 'string',
          description: 'Thông tin số tài khoản đã được mã hóa bằng RSA/PGP public key tương ứng của Nomeo Bank',
          example: 'RSA(account_number, bank_code, timestamp)',
        },
        hashedPayload: {
          type: 'string',
          description: 'Chuỗi hash SHA-256 của encryptedPayload và secret key tương ứng của ngân hàng liên kết',
          example: 'SHA256(encryptedPayload)',
        },
      },
      required: ['encryptedPayload', 'hashedPayload'],
    },
  })
  @Public()
  @UseGuards(CustomerInfoGuard)
  @HttpCode(HttpStatus.OK)
  @Post('recipient_profile')
  findRecipientProfile(@Req() req: Request) {
    return this.transactionsService.findRecipientProfile(
      req.user['account_number'],
      req.user['bank'],
      req.user['encryptMethod']
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
    status: HttpStatus.OK,
    description: 'Nhận giao dịch từ ngân hàng khác thành công.',
    schema: {
      type: 'object',
      properties: {
        encryptedPayload: {
          type: 'string',
          description: 'statusCode của request đã được mã hóa mà được giải mã bằng RSA/PGP private key tương ứng của ngân hàng liên kết.',
          example: 'RSA(statusCode)',
        },
        signature: {
          type: 'string',
          description: 'Chữ kí số của giao dịch do Nomeo Bank tạo bằng RSA/PGP private key.',
          example: 'SignBySHA256(encryptedPayload)',
        }
      },
    },
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        encryptMethod: {
          type: 'string',
          description: 'Cơ chế mã hóa (RSA/PGP)',
          example: 'RSA or PGP',
        },
        encryptedPayload: {
          type: 'string',
          description: 'Thông tin giao dịch đã được mã hóa bằng RSA/PGP public key tương ứng của Nomeo Bank',
          example: 'RSA(transaction)',
        },
        hashedPayload: {
          type: 'string',
          description: 'Chuỗi hash SHA-256 của encryptedPayload và secret key tương ứng của ngân hàng liên kết',
          example: 'SHA256(hashedPayload + secretKey)',
        },
        signature: {
          type: 'string',
          description: 'Chữ kí số của giao dịch do ngân hàng liên kết tạo bằng RSA/PGP private key',
          example: 'SignBySHA256(encryptedPayload)',
        }
      },
      required: ['encryptedPayload', 'hashedPayload', 'signature'],
    },
  })
  @Public()
  @UseGuards(TransactionGuard)
  @Post('external/receive')
  receiveExternalTransaction(@Req() req: Request) {
    return this.transactionsService.receiveExternalTransaction(
      req.user['signature'],
      req.user['payload'],
      req.user['encryptMethod']
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
    example: 'ACC123456789',
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
