import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/createEmployee.dto';
import { UpdateEmployeeDto } from './dto/updateEmployee.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
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
        },
      });

      return {
        message: 'Employee created successfully',
        data: employee
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

  async remove(id: number) {
    return `This action removes a #${id} employee`;
  }
}
