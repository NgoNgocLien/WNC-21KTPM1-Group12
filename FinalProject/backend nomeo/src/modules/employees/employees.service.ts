import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/createEmployee.dto';
import { UpdateEmployeeDto } from './dto/updateEmployee.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { employee_status, Prisma } from '@prisma/client';
import { CreateDepositDto } from './dto/createDeposit.dto';
import { ppid } from 'process';
const bcrypt = require('bcrypt');

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    try {
      const employee = await this.prisma.employees.create({
        data: {
          username: createEmployeeDto.username,
          password: bcrypt.hashSync(createEmployeeDto.password, 10),
          fullname: createEmployeeDto.fullname,
          email: createEmployeeDto.email,
          phone: createEmployeeDto.phone,
          status: employee_status.ACTIVE
        },
      });

      return {
        message: 'Thêm mới nhân viên thành công',
        data: employee,
      };
    } catch (error) {
        console.log(error.message)
        throw new InternalServerErrorException('Lỗi hệ thống');
    }
  }

  async findAll() {
    try {
      const employees = await this.prisma.employees.findMany({
        select: {
          id: true,
          username: true,
          fullname: true,
          email: true,
          phone: true,
          status: true
        },
      });

      return {
        message: 'Employees fetched successfully',
        data: employees,
      };
    } catch (error) {
      console.log(error.message)
      throw new InternalServerErrorException('Lỗi hệ thống');
    }
  }

  async findById(id: number) {
    try {
      const employee = await this.prisma.employees.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          username: true,
          fullname: true,
          email: true,
          phone: true,
          status: true
        },
      });
      return {
        message: 'Employee found successfully',
        data: employee,
      };
    } catch (error) {
      console.log(error.message)
      throw new InternalServerErrorException('Lỗi hệ thống');
    }
  }

  async findByUsername(username: string) {
    try {
      const employee = await this.prisma.employees.findUnique({
        where: {
          username,
        },
      });

      return {
        message: 'Employee found successfully',
        data: employee,
      };
    } catch (error) {
      console.log(error.message)
      throw new InternalServerErrorException('Lỗi hệ thống');
    }
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    try {
      const employee = await this.prisma.employees.update({
        where: {
          id,
        },
        data: updateEmployeeDto,
      });

      return {
        message: 'Employee updated successfully',
        data: employee,
      };
    } catch (error) {
      console.log(error.message)
      throw new InternalServerErrorException('Lỗi hệ thống');
    }
  }

  async updateEmployee(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    try {
      const updatedData: any = {
        username: updateEmployeeDto.username,
        fullname: updateEmployeeDto.fullname,
        email: updateEmployeeDto.email,
        phone: updateEmployeeDto.phone,
        status: updateEmployeeDto.status,
      };
  
      if (updateEmployeeDto.password && updateEmployeeDto.password !== undefined) {
        updatedData.password = bcrypt.hashSync(updateEmployeeDto.password, 10);
      }

      const existingEmployee = await this.prisma.employees.findUnique({
        where: { phone: updateEmployeeDto.phone },
      });
      if (existingEmployee && existingEmployee.id !== id) {
        throw new ConflictException('Số điện thoại đã được sử dụng');
      }
  
      const employee = await this.prisma.employees.update({
        where: {
          id,
        },
        data: updatedData,
        select: {
          id: true,
          username: true,
          fullname: true,
          email: true,
          phone: true,
          status: true,
        },
      });

      return {
        message: 'Cập nhật nhân viên thành công',
        data: employee,
      };
    } catch (error) {
      console.log(error.message)
      if (error instanceof ConflictException) {
        throw error; 
      }
      
      throw new InternalServerErrorException('Lỗi hệ thống');
    }
  }

  async remove(id: number) {
    try {
      const employeeExists = await this.prisma.employees.findFirst({
        where: {
          id,
        },
      });
      if (!employeeExists) {
        throw new NotFoundException(`Nhân viên không tồn tại`);
      }

      const employee = await this.prisma.employees.update({
        where: {
          id,
        },
        data:{
          status: employee_status.DELETED
        }
      });

      return {
        message: 'Xóa nhân viên thành công',
        data: employee
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.log(error.message)
      throw new InternalServerErrorException('Lỗi hệ thống');
    }
  }

  async makeDeposit(createDepositDto: CreateDepositDto) {
    try {
      const deposit = await this.prisma.deposits.create({
        data: {
          id_customer: createDepositDto.id_customer,
          id_employee: createDepositDto.id_employee,
          deposit_amount: new Prisma.Decimal(createDepositDto.deposit_amount),
          deposit_message: createDepositDto.deposit_message,
        },
      });

      await this.prisma.accounts.updateMany({
        where:{
          id_customer: deposit.id_customer
        },
        data:{
          account_balance:{
            increment: deposit.deposit_amount
          }
        }
        
      })

      return {
        message: 'Nạp tiền thành công',
        data: deposit,
      };
    } catch (error) {
      console.log(error.message)
      throw new InternalServerErrorException('Lỗi hệ thống');
    }
  }
}
