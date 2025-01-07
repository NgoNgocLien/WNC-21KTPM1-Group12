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
  })
  @HttpCode(HttpStatus.OK)
  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy thông tin tất cả nhân viên thành công',
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll() {
    return this.employeesService.findAll();
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy thông tin nhân viên thành công',
  })
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  findOne(@Req() req: Request) {
    return this.employeesService.findById(req.user['sub']);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật nhân viên thành công',
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
  })
  @HttpCode(HttpStatus.OK)
  @Post('/deposit')
  makeDeposit(@Body() createDepositDto: CreateDepositDto) {
    return this.employeesService.makeDeposit(createDepositDto);
  }
}
