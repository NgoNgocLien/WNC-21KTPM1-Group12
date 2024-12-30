import { Injectable, NotFoundException } from '@nestjs/common';
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
      throw new Error('Error creating employee: ' + error.message);
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
      throw new Error('Error fetching employees: ' + error.message);
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
      throw new Error('Error finding employee: ' + error.message);
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
      throw new Error('Error finding employee: ' + error.message);
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
      throw new Error('Error updating employee: ' + error.message);
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
      throw new Error('Error updating employee: ' + error.message);
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
        throw new NotFoundException(`Employee not found`);
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
      throw new Error('Error deleting employee: ' + error.message);
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
      throw new Error('Error creating deposit: ' + error.message);
    }
  }
}
