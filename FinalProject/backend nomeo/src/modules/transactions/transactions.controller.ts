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
    console.log(JSON.stringify(createTransactionDto))
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
    description: 'Lấy tất cả giao dịch với ngân hàng khác thành công',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Giao dịch của các ngân hàng khác đã được tìm thấy.',
        },
        data: {
          type: 'object',
          properties: {
            transactions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  sender_account_number: { type: 'string', example: 'ACC100000001' },
                  id_sender_bank: { type: 'integer', example: 1 },
                  recipient_account_number: { type: 'string', example: 'VIE10234567' },
                  id_recipient_bank: { type: 'integer', example: 3 },
                  transaction_amount: { type: 'string', example: '22453' },
                  transaction_message: { type: 'string', example: 'NGAN HA chuyen tien' },
                  fee_payment_method: {
                    type: 'string',
                    enum: ['SENDER', 'RECIPIENT'],
                    example: 'RECIPIENT',
                  },
                  transaction_time: {
                    type: 'string',
                    format: 'date-time',
                    example: '2025-01-08T18:18:42.541Z',
                  },
                  recipient_name: { type: 'string', example: 'Phan Trường Ngọc' },
                  id: { type: 'string', format: 'uuid', example: '496c06e5-f43b-4634-b8d5-a4eec3f8a0a1' },
                  fee_amount: { type: 'string', example: '1000' },
                  type: { type: 'string', enum: ['Sender', 'Recipient'], example: 'Sender' },
                },
              },
            },
            banks: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer', example: 3 },
                  name: { type: 'string', example: 'VietBank' },
                  logo: { type: 'string', nullable: true, example: null },
                },
              },
            },
          },
        },
      },
    },
  })
  @Get('external')
  findExternalTransactions() {
    return this.transactionsService.getExternalTransactions();
  }
  

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy tất cả giao dịch của khách hàng thành công',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Lấy thông tin giao dịch của khách hàng thành công',
        },
        data: {
          type: 'object',
          properties: {
            transactions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  sender_account_number: { type: 'string', example: 'ACC123456789' },
                  id_sender_bank: { type: 'integer', example: 1 },
                  recipient_account_number: { type: 'string', example: 'VIE1234567' },
                  id_recipient_bank: { type: 'integer', example: 3 },
                  transaction_amount: { type: 'integer', example: 22453 },
                  transaction_message: { type: 'string', example: 'JOHN DOE chuyen tien' },
                  fee_payment_method: {
                    type: 'string',
                    enum: ['SENDER', 'RECIPIENT'],
                    example: 'RECIPIENT',
                  },
                  transaction_time: {
                    type: 'string',
                    format: 'date-time',
                    example: '2025-01-08T18:18:42.541Z',
                  },
                  recipient_name: { type: 'string', example: 'Phan Mỹ Linh' },
                  id: { type: 'string', format: 'uuid', example: '496c06e5-f43b-4634-b8d5-a4eec3f8a0a1' },
                  fee_amount: { type: 'string', example: '1000' },
                  type: { type: 'string', enum: ['Sender', 'Recipient', 'Deposit', 'Sender (Debt)', 'Recipient (Debt)'], example: 'Sender' },
                  current_balance: { type: 'integer', example: 86712033 },
                },
              },
            },
          },
          example: [
            {
              sender_account_number: "A1234567",
              id_sender_bank: 2,
              recipient_account_number: "ACC1234569",
              id_recipient_bank: 1,
              transaction_amount: 100000,
              transaction_message: "Happy birthday",
              fee_payment_method: "SENDER",
              transaction_time: "2025-01-07T07:28:54.780Z",
              recipient_name: "Ngan Ha",
              id: "c80a747d-c37e-4fab-9b43-12c86baf6",
              fee_amount: "1000",
              type: "Recipient",
              current_balance: 87744743
            },
            {
              id: 12,
              id_employee: 1,
              id_customer: 1,
              deposit_amount: "444444",
              deposit_message: "Monthly deposit",
              deposit_time: "2025-01-04T20:03:21.337Z",
              type: "Deposit",
              transaction_time: "2025-01-04T20:03:21.337Z",
              transaction_amount: 44444,
              current_balance: 87526332
            },
          ],
        },
      },
    },
  })
  @Get('account')
  findAccountTransactions(@Req() req: Request) {
    return this.transactionsService.getAccountTransactions(req.user['sub']);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy tất cả giao dịch theo số tài khoản của khách hàng thành công',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Lấy tất cả giao dịch theo số tài khoản của khách hàng thành công',
        },
        data: {
          type: 'object',
          properties: {
            transactions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  sender_account_number: { type: 'string', example: 'ACC123456789' },
                  id_sender_bank: { type: 'integer', example: 1 },
                  recipient_account_number: { type: 'string', example: 'VIE1234567' },
                  id_recipient_bank: { type: 'integer', example: 3 },
                  transaction_amount: { type: 'integer', example: 22453 },
                  transaction_message: { type: 'string', example: 'JOHN DOE chuyen tien' },
                  fee_payment_method: {
                    type: 'string',
                    enum: ['SENDER', 'RECIPIENT'],
                    example: 'RECIPIENT',
                  },
                  transaction_time: {
                    type: 'string',
                    format: 'date-time',
                    example: '2025-01-08T18:18:42.541Z',
                  },
                  recipient_name: { type: 'string', example: 'Phan Mỹ Linh' },
                  id: { type: 'string', format: 'uuid', example: '496c06e5-f43b-4634-b8d5-a4eec3f8a0a1' },
                  fee_amount: { type: 'string', example: '1000' },
                  type: { type: 'string', enum: ['Sender', 'Recipient', 'Deposit', 'Sender (Debt)', 'Recipient (Debt)'], example: 'Sender' },
                  current_balance: { type: 'integer', example: 86712033 },
                },
              },
            },
          },
          example: [
            {
              sender_account_number: "A1234567",
              id_sender_bank: 2,
              recipient_account_number: "ACC123456789",
              id_recipient_bank: 1,
              transaction_amount: 100000,
              transaction_message: "Happy birthday",
              fee_payment_method: "SENDER",
              transaction_time: "2025-01-07T07:28:54.780Z",
              recipient_name: "Ngan Ha",
              id: "c80a747d-c37e-4fab-9b43-12c86baf6",
              fee_amount: "1000",
              type: "Recipient",
              current_balance: 87744743
            },
            {
              id: 12,
              id_employee: 1,
              id_customer: 1,
              deposit_amount: "444444",
              deposit_message: "Monthly deposit",
              deposit_time: "2025-01-04T20:03:21.337Z",
              type: "Deposit",
              transaction_time: "2025-01-04T20:03:21.337Z",
              transaction_amount: 44444,
              current_balance: 87526332
            },
          ],
        },
      },
    },
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

  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Lấy tất cả giao dịch của ngân hàng thành công',
  // })
  // @Get('bank')
  // findBankTransactions() {
  //   return this.transactionsService.findBankTransactions();
  // }
}
