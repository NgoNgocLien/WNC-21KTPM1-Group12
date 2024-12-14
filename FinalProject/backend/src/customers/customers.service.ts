import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateCustomerDto } from './dto/updateCustomer.dto';
import { CreateContactDto } from './dto/createContact.dto';
import { UpdateContactDto } from './dto/updateContact.dto';
import { DeleteContactDto } from './dto/deleteContact.dto';
import { CreateCustomerDto } from './dto/createCustomer.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllCustomers() {
    return this.prisma.customers.findMany();
  }

  async findByUsername(username: string) {
    return this.prisma.customers.findUnique({
      where: {
        username,
      },
    });
  }

  async findById(id: number) {
    return this.prisma.customers.findUnique({
      where: {
        id: Number(id),
      },
    });
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    const customerExists = await this.prisma.customers.findUnique({ where: { id } });
    if (!customerExists) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    return this.prisma.customers.update({
      where: {
        id: id,
      },
      data: updateCustomerDto,
    });
  }

  async create(createCustomerDto: CreateCustomerDto) {
    // TODO: Hash the password before saving it to the database

    return this.prisma.customers.create({
      data: createCustomerDto,
    });
  }

  async getAllAccounts(id: number){
    const customerExists = await this.prisma.customers.findUnique({ where: { id } });
    if (!customerExists) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    return this.prisma.accounts.findMany({
      where:{
        id_customer: id
      }
    });
  }

  async getAllContacts(id: number){
    const customerExists = await this.prisma.customers.findUnique({ where: { id } });
    if (!customerExists) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    return this.prisma.contacts.findMany({
      where:{
        id_customer: id
      },
      include: {
        banks: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async createOneContact(data: CreateContactDto){
    const customerExists = await this.prisma.customers.findUnique({ where: { id: data.id_customer } });
    if (!customerExists) {
      throw new NotFoundException(`Customer with id ${data.id_customer} not found`);
    }

    const contactExists = await this.prisma.contacts.findFirst({ 
      where: { 
        id_customer: data.id_customer,
        contact_account_number: data.contact_account_number
      } 
    });
    if (contactExists) {
      throw new ConflictException(`Contact exists`);
    }

    return this.prisma.contacts.create({
      data
    });
  }

  async updateOneContact(id_customer: number, data: UpdateContactDto){
    const contactExists = await this.prisma.contacts.findFirst({ 
      where: { 
        id: data.id,
        contact_account_number: data.contact_account_number
      } 
    });
    if (!contactExists) {
      throw new NotFoundException(`Contact not found`);
    }

    return this.prisma.contacts.update({
      where:{
        id: data.id,
        id_customer
      },
      data:{
        nickname: data.nickname
      }
    });
  }

  async deleteOneContact(data: DeleteContactDto){
    const contactExists = await this.prisma.contacts.findFirst({ 
      where: { 
        id: data.id
      } 
    });
    if (!contactExists) {
      throw new NotFoundException(`Contact not found`);
    }

    return this.prisma.contacts.delete({
      where:{
        id: data.id
      }
    })
  }


}
