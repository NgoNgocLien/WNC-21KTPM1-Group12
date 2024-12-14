import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateCustomerDto } from './dto/updateCustomer.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: number) {
    return this.prisma.customers.findUnique({
      where: {
        id: id,
      },
    });
  }

  async findByUsername(username: string) {
    return this.prisma.customers.findUnique({
      where: {
        username,
      },
    });
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    const customer = this.prisma.customers.update({
      where: {
        id: id,
      },
      data: updateCustomerDto,
    });
    return customer;
  }
}
