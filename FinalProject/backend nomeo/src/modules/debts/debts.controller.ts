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
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

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
    schema: {
      description: 'Thông tin nhắc nợ vừa tạo',
      example: {
        message: 'Debt created successfully',
        data: {
          id: 76,
          id_creditor: 1,
          id_debtor: 1,
          debt_amount: '100000',
          debt_message: 'Nguyễn Văn A nhắc trả tiền nước',
          status: 'PENDING',
          created_at: '2025-01-08T20:09:16.185Z',
          debtor: {
            fullname: 'Trần Thị B',
          },
          creditor: {
            fullname: 'Nguyễn Văn A',
          },
        },
      },
    },
  })
  @Post()
  create(@Body() createDebtDto: CreateDebtDto) {
    return this.debtsService.create(createDebtDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy tất cả nhắc nợ thành công',
    schema: {
      description: 'Danh sách nhắc nợ',
      example: {
        message: 'Debts fetched successfully',
        data: [
          {
            id: 1,
            id_creditor: 4,
            id_debtor: 2,
            debt_amount: '256000',
            debt_message: 'Nguyễn Văn A nhắc trả tiền',
            status: 'CANCELED',
            created_at: '2024-12-31T18:45:52.461Z',
          },
          {
            id: 2,
            id_creditor: 1,
            id_debtor: 4,
            debt_amount: '2563000',
            debt_message: null,
            status: 'PENDING',
            created_at: '2024-12-31T18:48:04.352Z',
          },
          {
            id: 3,
            id_creditor: 1,
            id_debtor: 2,
            debt_amount: '55400',
            debt_message: 'JOHN DOE nhắc trả tiền',
            status: 'PAID',
            created_at: '2024-12-31T18:53:47.905Z',
          },
          {
            id: 4,
            id_creditor: 1,
            id_debtor: 4,
            debt_amount: '764000',
            debt_message: 'JOHN DOE nhắc trả tiền',
            status: 'DECLINED',
            created_at: '2024-12-31T18:59:32.179Z',
          },
        ],
      },
    },
  })
  @Get()
  findAll() {
    return this.debtsService.findAll();
  }

  /*
  {
  "message": "Outgoing debts fetched successfully",
  "data": {
    "pending": [
      {
        "id": 77,
        "id_creditor": 1,
        "id_debtor": 3,
        "debt_amount": "100000",
        "debt_message": "Nguyễn Văn A nhắc trả tiền nước",
        "status": "PENDING",
        "created_at": "2025-01-08T20:13:15.739Z",
        "debtor": {
          "id": 3,
          "username": "lienngo",
          "fullname": "Ngô Ngọc Liên",
          "accounts": [
            {
              "account_number": "ACC100000001"
            }
          ]
        },
        "debt_deletions": null,
        "debt_payments": []
      },
      "completed": [
      {
        "id": 72,
        "id_creditor": 1,
        "id_debtor": 3,
        "debt_amount": "256000",
        "debt_message": " nhắc trả tiền",
        "status": "DECLINED",
        "created_at": "2025-01-05T09:04:18.883Z",
        "debtor": {
          "id": 3,
          "username": "lienngo",
          "fullname": "Ngô Ngọc Liên",
          "accounts": [
            {
              "account_number": "ACC100000001"
            }
          ]
        },
        "debt_deletions": {
          "deletion_message": ""
        },
        "debt_payments": []
      },
}
}
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy tất cả nhắc nợ đã tạo thành công',
    schema: {
      description: 'Danh sách nhắc nợ',
      example: {
        message: 'Outgoing debts fetched successfully',
        data: {
          pending: [
            {
              id: 77,
              id_creditor: 1,
              id_debtor: 3,
              debt_amount: '100000',
              debt_message: 'Nguyễn Văn A nhắc trả tiền nước',
              status: 'PENDING',
              created_at: '2025-01-08T20:13:15.739Z',
              debtor: {
                id: 3,
                username: 'lienngo',
                fullname: 'Ngô Ngọc Liên',
                accounts: [
                  {
                    account_number: 'ACC100000001',
                  },
                ],
              },
              debt_deletions: null,
              debt_payments: [],
            },
          ],
          completed: [
            {
              id: 72,
              id_creditor: 1,
              id_debtor: 3,
              debt_amount: '256000',
              debt_message: ' nhắc trả tiền',
              status: 'DECLINED',
              created_at: '2025-01-05T09:04:18.883Z',
              debtor: {
                id: 3,
                username: 'lienngo',
                fullname: 'Ngô Ngọc Liên',
                accounts: [
                  {
                    account_number: 'ACC100000001',
                  },
                ],
              },
              debt_deletions: {
                deletion_message: 'Đã trả tiền mặt',
              },
              debt_payments: [],
            },
            {
              id: 70,
              id_creditor: 1,
              id_debtor: 3,
              debt_amount: '32000',
              debt_message: 'Nhắc trả tiền đồ ăn trưa hôm qua',
              status: 'PAID',
              created_at: '2025-01-05T08:59:49.762Z',
              debtor: {
                id: 3,
                username: 'lienngo',
                fullname: 'Ngô Ngọc Liên',
                accounts: [
                  {
                    account_number: 'ACC100000001',
                  },
                ],
              },
              debt_deletions: null,
              debt_payments: [
                {
                  transactions: {
                    transaction_message: 'NGÔ NGỌC LIÊN thanh toan no',
                  },
                },
              ],
            },
          ],
        },
      },
    },
  })
  @Get('/outgoing')
  findOutgoing(@Req() req: Request) {
    return this.debtsService.findOutgoing(req.user['sub']);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy tất cả nhắc nợ đã nhận từ người khác thành công',
    schema: {
      description: 'Danh sách nhắc nợ',
      example: {
        message: 'Incoming debts fetched successfully',
        data: [
          {
            id: 78,
            id_creditor: 2,
            id_debtor: 1,
            debt_amount: '100000',
            debt_message: 'Nguyễn Văn A nhắc trả tiền nước',
            status: 'PENDING',
            created_at: '2025-01-08T20:14:44.177Z',
            creditor: {
              id: 2,
              username: 'john_doe',
              fullname: 'JOHN DOE',
              accounts: [
                {
                  account_number: 'ACC123456789',
                },
              ],
            },
            debt_deletions: null,
            debt_payments: [],
          },
        ],
      },
    },
  })
  @Get('/incoming')
  findIncoming(@Req() req: Request) {
    return this.debtsService.findIncoming(req.user['sub']);
  }

  @ApiExcludeEndpoint()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy tất cả nhắc nợ đang chờ xử lý thành công',
  })
  @Get('/pending')
  findPending(@Req() req: Request) {
    return this.debtsService.findPending(req.user['sub']);
  }

  @ApiExcludeEndpoint()
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
    schema: {
      description: 'Thông tin nhắc nợ',
      example: {
        message: 'Debt fetched successfully',
        data: {
          id: 1,
          id_creditor: 4,
          id_debtor: 2,
          debt_amount: '256000',
          debt_message: 'Nguyễn Văn A nhắc trả tiền',
          status: 'CANCELED',
          created_at: '2024-12-31T18:45:52.461Z',
        },
      },
    },
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID của nhắc nợ',
    required: true,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy thông tin nhắc nợ theo ID thành công',
    schema: {
      description: 'Thông tin nhắc nợ',
      example: {
        message: 'Debt fetched successfully',
        data: {
          id: 1,
          id_creditor: 4,
          id_debtor: 2,
          debt_amount: '256000',
          debt_message: 'Nguyễn Văn A nhắc trả tiền',
          status: 'CANCELED',
          created_at: '2024-12-31T18:45:52.461Z',
        },
      },
    },
  })
  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.debtsService.findOne(id);
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Hủy nhắc nợ thành công',
    schema: {
      description: 'Thông tin nhắc nợ vừa hủy',
      example: {
        message: 'Debt deleted successfully',
        data: {
          debt: {
            id: 76,
            id_creditor: 1,
            id_debtor: 1,
            debt_amount: '100000',
            debt_message: 'Nguyễn Văn A nhắc trả tiền nước',
            status: 'PENDING',
            created_at: '2025-01-08T20:09:16.185Z',
            debtor: {
              fullname: 'Trần Thị B',
            },
            creditor: {
              fullname: 'Nguyễn Văn A',
            },
          },
          debtDeletion: {
            id_debt: 76,
            id_deleter: 1,
            deletion_message: 'Người này không có tiền trả',
            deletion_time: '2025-01-08T20:09:16.185Z',
          },
        },
      },
    },
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
    schema: {
      description: 'Thông tin nhắc nợ vừa từ chối',
      example: {
        message: 'Debt declined successfully',
        data: {
          debt: {
            id: 76,
            id_creditor: 1,
            id_debtor: 1,
            debt_amount: '100000',
            debt_message: 'Nguyễn Văn A nhắc trả tiền nước',
            status: 'PENDING',
            created_at: '2025-01-08T20:09:16.185Z',
            debtor: {
              fullname: 'Trần Thị B',
            },
            creditor: {
              fullname: 'Nguyễn Văn A',
            },
          },
        },
        debtDeletion: {
          id_debt: 76,
          id_deleter: 1,
          deletion_message: 'Người này không có tiền trả',
          deletion_time: '2025-01-08T20:09:16.185Z',
        },
      },
    },
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
    schema: {
      description: 'Thông tin thanh toán nợ',
      example: {
        message: 'Debt paid successfully',
        data: {
          debt: {
            id: 76,
            id_creditor: 1,
            id_debtor: 1,
            debt_amount: '100000',
            debt_message: 'Nguyễn Văn A nhắc trả tiền nước',
            status: 'PAID',
            created_at: '2025-01-08T20:09:16.185Z',
            debtor: {
              fullname: 'Trần Thị B',
            },
            creditor: {
              fullname: 'Nguyễn Văn A',
            },
          },
          debtPayment: {
            id_debt: 76,
            id_transaction: 1,
            transaction: {
              transaction_message: 'NGUYEN VAN A thanh toan no',
            },
          },
        },
      },
    },
  })
  @Post('/pay/:id')
  payDebt(
    @Param('id', ParseIntPipe) id: number,
    @Body() payDebtDto: PayDebtDto,
  ) {
    return this.debtsService.payDebt(id, payDebtDto);
  }
}
