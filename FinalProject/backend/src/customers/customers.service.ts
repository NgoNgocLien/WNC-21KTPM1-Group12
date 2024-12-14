import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { PrismaClient } from '@prisma/client';
import { UpdateCustomerDto } from './dto/update-customer.dto';

export type Customer = {
  id: string;
  username: string;
  password: string;
  fullname: string;
  email: string;
  phone: string;
  refreshToken: string;
};

@Injectable()
export class CustomersService {
  constructor(private readonly databaseService: DatabaseService) {}
  private readonly customers = [
    {
      id: '1',
      username: 'johndoe',
      password: '$2b$10$fsW9WYvtyKVNHmXv3YzuVuMI2h1fdGmt5P1hsHa74RzOnwNozQcGC',
      fullname: 'John Doe',
      email: 'john.doe@gmail.com',
      phone: '0901231234',
      refreshToken: '',
    },
    {
      id: '2',
      username: 'janedoe',
      password: '$2b$10$fsW9WYvtyKVNHmXv3YzuVuMI2h1fdGmt5P1hsHa74RzOnwNozQcGC',
      fullname: 'Jane Doe',
      email: 'jane.doe@gmail.com',
      phone: '0901231235',
      refreshToken: '',
    },
  ];

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
