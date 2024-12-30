import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/createEmployee.dto';
import { UpdateEmployeeDto } from './dto/updateEmployee.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { employee_status } from '@prisma/client';
import { CreateDepositDto } from './dto/createDeposit.dto';
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
        message: 'Employee created successfully',
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
      const employee = await this.prisma.employees.update({
        where: {
          id,
        },
        data: {
          username: updateEmployeeDto.username,
          password: bcrypt.hashSync(updateEmployeeDto.password, 10),
          fullname: updateEmployeeDto.fullname,
          email: updateEmployeeDto.email,
          phone: updateEmployeeDto.phone,
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
        message: 'Employee updated successfully',
        data: employee,
      };
    } catch (error) {
      console.log(error.message)
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

      await this.prisma.employees.update({
        where: {
          id,
        },
        data:{
          status: employee_status.DELETED
        }
      });

      return {
        message: 'Employee deleted successfully'
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
          deposit_amount: createDepositDto.deposit_amount,
          deposit_message: createDepositDto.deposit_message,
        },
      });

      return {
        message: 'Deposit created successfully',
        data: deposit,
      };
    } catch (error) {
      console.log(error.message)
      throw new InternalServerErrorException('Lỗi hệ thống');
    }
  }
}
