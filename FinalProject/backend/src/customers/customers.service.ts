import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { PrismaClient } from '@prisma/client';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findOne(id: number) {
    return this.databaseService.customers.findUnique({
      where: {
        id: id,
      },
    });
  }

  async findByUsername(username: string) {
    return this.databaseService.customers.findUnique({
      where: {
        username: username,
      },
    });
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    const customer = this.databaseService.customers.update({
      where: {
        id: id,
      },
      data: updateCustomerDto,
    });
    return null;
  }
}
