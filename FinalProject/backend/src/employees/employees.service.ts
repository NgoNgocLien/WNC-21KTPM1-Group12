import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/createEmployee.dto';
import { UpdateEmployeeDto } from './dto/updateEmployee.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    return 'This action adds a new employee';
  }

  async findAll() {
    return `This action returns all employees`;
  }

  async findOne(id: number) {
    return this.prisma.employees.findUnique({
      where: {
        id,
      },
    });
  }

  async findByUsername(username: string) {
    return this.prisma.employees.findUnique({
      where: {
        username,
      },
    });
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    const employee = this.prisma.employees.update({
      where: {
        id,
      },
      data: updateEmployeeDto,
    });
    return employee;
  }

  async remove(id: number) {
    return `This action removes a #${id} employee`;
  }
}
