import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateCustomerDto } from './dto/updateCustomer.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllCustomers(){
    return this.prisma.customers.findMany();
  }

  async findByUsername(username: string) {
    return this.prisma.customers.findUnique({
      where: {
        username,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.customers.findUnique({
      where:{
        id: Number(id)
      }
    })
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    const customerExists = await this.prisma.customers.findUnique({ where: { id: Number(id) } });
    if (!customerExists) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    const customer = this.prisma.customers.update({
      where: {
        id: id,
      },
      data: updateCustomerDto,
    });
    return null;
  }
}
