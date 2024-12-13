import { Injectable } from '@nestjs/common';

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

  async findOne(username: string) {
    return this.customers.find((customer) => customer.username === username);
  }

  async findById(id: string) {
    return this.customers.find((customer) => customer.id === id);
  }

  async update(id: string, update: Partial<Customer>) {
    const customer = this.customers.find((customer) => customer.id === id);
    if (customer) {
      Object.assign(customer, update);
      return customer;
    }
    return null;
  }
}
