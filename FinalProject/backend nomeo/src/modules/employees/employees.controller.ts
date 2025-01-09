import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/createEmployee.dto';
import { UpdateEmployeeDto } from './dto/updateEmployee.dto';
import { CreateDepositDto } from './dto/createDeposit.dto';
import { ParseIntPipe } from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Employees')
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
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tạo nhân viên thành công',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Thêm mới nhân viên thành công',
        },
        data: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            username: {
              type: 'string',
              example: 'employee20',
            },
            fullname: {
              type: 'string',
              example: 'Phạm Minh Châu',
            },
            email: {
              type: 'string',
              example: 'chaupm@example.com',
            },
            phone: {
              type: 'string',
              example: '0901231234',
            },
            status: {
              type: 'string',
              enum: ['ACTIVE', 'DELETED'],
              example: 'ACTIVE',
              description: 'Trạng thái của nhân viên. ' +
                           'ACTIVE: Nhân viên đang hoạt động, ' +
                           'DELETED: Nhân viên đã bị xóa.',
            },
          },
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy thông tin tất cả nhân viên thành công',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Lấy thông tin tất cả nhân viên thành công',
        },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
                example: 1,
              },
              username: {
                type: 'string',
                example: 'employee20',
              },
              fullname: {
                type: 'string',
                example: 'Phạm Minh Châu',
              },
              email: {
                type: 'string',
                example: 'chaupm@example.com',
              },
              phone: {
                type: 'string',
                example: '0901231234',
              },
              status: {
                type: 'string',
                enum: ['ACTIVE', 'DELETED'],
                example: 'ACTIVE',
                description: 'Trạng thái của nhân viên. ' +
                             'ACTIVE: Nhân viên đang hoạt động, ' +
                             'DELETED: Nhân viên đã bị xóa.',
              },
            },
          },
          example: [
            {
              id: 1,
              username: 'employee20',
              fullname: 'Phạm Minh Châu',
              email: 'chaupm@example.com',
              phone: '0901231234',
              status: 'ACTIVE',
            },
            {
              id: 2,
              username: 'employee21',
              fullname: 'Nguyễn Thị Mai',
              email: 'mai@example.com',
              phone: '0909876543',
              status: 'DELETED',
            },
          ],
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll() {
    return this.employeesService.findAll();
  }
  

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy thông tin nhân viên thành công',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Lấy thông tin nhân viên thành công',
        },
        data: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            username: {
              type: 'string',
              example: 'employee20',
            },
            fullname: {
              type: 'string',
              example: 'Phạm Minh Châu',
            },
            email: {
              type: 'string',
              example: 'chaupm@example.com',
            },
            phone: {
              type: 'string',
              example: '0901231234',
            },
            status: {
              type: 'string',
              enum: ['ACTIVE', 'DELETED'],
              example: 'ACTIVE',
              description: 'Trạng thái của nhân viên. ' +
                           'ACTIVE: Nhân viên đang hoạt động, ' +
                           'DELETED: Nhân viên đã bị xóa.',
            },
          },
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  findOne(@Req() req: Request) {
    return this.employeesService.findById(req.user['sub']);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật nhân viên thành công',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Cập nhật nhân viên thành công',
        },
        data: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            username: {
              type: 'string',
              example: 'employee20',
            },
            fullname: {
              type: 'string',
              example: 'Phạm Minh Châu',
            },
            email: {
              type: 'string',
              example: 'chaupm@example.com',
            },
            phone: {
              type: 'string',
              example: '0901231234',
            },
            status: {
              type: 'string',
              enum: ['ACTIVE', 'DELETED'],
              example: 'ACTIVE',
              description: 'Trạng thái của nhân viên. ' +
                           'ACTIVE: Nhân viên đang hoạt động, ' +
                           'DELETED: Nhân viên đã bị xóa.',
            },
          },
        },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: 'ID nhân viên',
    example: 1,
    required: true,
  })
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.updateEmployee(id, updateEmployeeDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Xóa nhân viên thành công',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Xóa nhân viên thành công',
        },
        data: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            username: {
              type: 'string',
              example: 'employee20',
            },
            fullname: {
              type: 'string',
              example: 'Phạm Minh Châu',
            },
            email: {
              type: 'string',
              example: 'chaupm@example.com',
            },
            phone: {
              type: 'string',
              example: '0901231234',
            },
            status: {
              type: 'string',
              enum: ['ACTIVE', 'DELETED'],
              example: 'DELETED',
              description: 'Trạng thái của nhân viên. ' +
                           'ACTIVE: Nhân viên đang hoạt động, ' +
                           'DELETED: Nhân viên đã bị xóa.',
            },
          },
        },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: 'ID nhân viên',
    example: 1,
    required: true,
  })
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.remove(id);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Nạp tiền thành công',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Nạp tiền thành công',
        },
        data: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 15,
            },
            id_employee: {
              type: 'integer',
              example: 2,
            },
            id_customer: {
              type: 'integer',
              example: 1,
            },
            deposit_amount: {
              type: 'string',
              example: '200000',
            },
            deposit_message: {
              type: 'string',
              example: 'Nạp tiền',
            },
            deposit_time: {
              type: 'string',
              format: 'date-time',
              example: '2025-01-09T05:23:50.272Z',
            },
          },
        },
      },
    }    
  })
  @HttpCode(HttpStatus.OK)
  @Post('/deposit')
  makeDeposit(@Body() createDepositDto: CreateDepositDto) {
    return this.employeesService.makeDeposit(createDepositDto);
  }
}
