import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UpdateCustomerDto } from './dto/updateCustomer.dto';
import { CreateContactDto } from './dto/createContact.dto';
import { UpdateContactDto } from './dto/updateContact.dto';
import { DeleteContactDto } from './dto/deleteContact.dto';
import { CreateCustomerDto } from './dto/createCustomer.dto';
const bcrypt = require('bcrypt');
import { generateAccountNumber } from '../../common/utils/checksum.util';
import { sendMail } from '../../common/utils/sendMail';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllCustomers() {
    try {
      const customers = await this.prisma.customers.findMany();

      return {
        message: 'Customers fetched successfully',
        data: customers,
      };
    } catch (error) {
      throw new Error('Error fetching customers: ' + error.message);
    }
  }

  async findByUsername(username: string) {
    try {
      const customer = await this.prisma.customers.findUnique({
        where: {
          username,
        },
      });

      return {
        message: 'Customer found successfully',
        data: customer,
      };
    } catch (error) {
      throw new Error('Error finding customer: ' + error.message);
    }
  }

  async findById(id: number) {
    try {
      const customer = await this.prisma.customers.findUnique({
        where: {
          id: Number(id),
        },
      });

      return {
        message: 'Customer found successfully',
        data: customer,
      };
    } catch (error) {
      throw new Error('Error finding customer: ' + error.message);
    }
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    try {
      const customerExists = await this.prisma.customers.findUnique({
        where: { id },
      });
      if (!customerExists) {
        throw new NotFoundException(`Customer with id ${id} not found`);
      }

      const customer = this.prisma.customers.update({
        where: {
          id: id,
        },
        data: updateCustomerDto,
      });

      return {
        message: 'Customer updated successfully',
        data: customer,
      };

    } catch (error) {
      throw new Error('Error updating customer: ' + error.message);
    }
  }

  async createOneCustomer(createCustomerDto: CreateCustomerDto) {
    try {
      const customer = await this.prisma.customers.create({
        data: {
          username: createCustomerDto.username,
          password: bcrypt.hashSync(createCustomerDto.password, 10),
          fullname: createCustomerDto.fullname,
          email: createCustomerDto.email,
          phone: createCustomerDto.phone,
        },
      });
      // account_number có format kèm checksum sử dụng Luhn Algorithm để đảm bảo tính hợp lệ của số tài khoản
      const accountNumber = generateAccountNumber(customer.id);

      const account = await this.prisma.accounts.create({
        data: {
          id_customer: customer.id,
          account_number: accountNumber,
          account_balance: 0, 
        },
      });

      const htmlContent = `
        <html>
          <body>
            <p>Dear <strong> ${createCustomerDto.fullname}</strong>,</p>
            <p>We are pleased to inform you that your account has been successfully created in our system. Below are your login credentials:</p>
            <p><strong>Username:</strong> ${createCustomerDto.username} </p>
            <p><strong>Password:</strong> ${createCustomerDto.password} </p>
            <p>For security reasons, we strongly recommend that you change your password after your first login.</p>
            <p>If you did not request this account, please contact our support team immediately.</p>
            <p>Thank you for choosing NoMeoBank. We are excited to have you with us!</p>
            <p>Best regards,</p>
            <p><strong>The NoMeoBank</strong></p>
          </body>
        </html>
      `;

      await sendMail(
        createCustomerDto.email,
        'Welcome to NoMeoBank - Your Account Details',
        htmlContent,
      );

      return {
        message: 'Customer and account created successfully',
        data: {
          customer,
          account,
        },
      };

    } catch (error) {
      throw new Error('Error creating customer and account: ' + error.message);
    }
  }

  async getAllAccounts(id: number) {
    try{
      const customerExists = await this.prisma.customers.findUnique({
        where: { id },
      });
      if (!customerExists) {
        throw new NotFoundException(`Customer with id ${id} not found`);
      }

      const accounts = await this.prisma.accounts.findMany({
        where: {
          id_customer: id,
        },
      });

      return {
        message: 'Accounts found successfully',
        data: accounts,
      };

    } catch (error) {
      throw new Error('Error fetching accounts: ' + error.message);
    }
  }

  async getAllContacts(id: number) {
    try{
      const customerExists = await this.prisma.customers.findUnique({
        where: { id },
      });
      if (!customerExists) {
        throw new NotFoundException(`Customer with id ${id} not found`);
      }

      const contacts = await this.prisma.contacts.findMany({
        where: {
          id_customer: id,
        },
        include: {
          banks: {
            select: {
              name: true,
            },
          },
        },
      });

      return {
        message: 'Contacts found successfully',
        data: contacts,
      };

    } catch (error) {
      throw new Error('Error fetching contacts: ' + error.message);
    }
  }

  async createOneContact(data: CreateContactDto) {
    try{
      const customerExists = await this.prisma.customers.findUnique({
        where: { id: data.id_customer },
      });
      if (!customerExists) {
        throw new NotFoundException(
          `Customer with id ${data.id_customer} not found`,
        );
      }

      const contactExists = await this.prisma.contacts.findFirst({
        where: {
          id_customer: data.id_customer,
          contact_account_number: data.contact_account_number,
        },
      });
      if (contactExists) {
        throw new ConflictException(`Contact exists`);
      }

      const contact = await this.prisma.contacts.create({
        data,
      });

      return {
        message: 'Contact created successfully',
        data: contact,
      };

    } catch (error) {
      throw new Error('Error creating contact: ' + error.message);
    }
  }

  async updateOneContact(id_customer: number, data: UpdateContactDto) {
    try{
      const contactExists = await this.prisma.contacts.findFirst({
        where: {
          id: data.id,
          contact_account_number: data.contact_account_number,
        },
      });
      if (!contactExists) {
        throw new NotFoundException(`Contact not found`);
      }

      const contact = await this.prisma.contacts.update({
        where: {
          id: data.id,
          id_customer,
        },
        data: {
          nickname: data.nickname,
        },
      });

      return {
        message: 'Contact updated successfully',
        data: contact,
      };

    } catch (error) {
      throw new Error('Error updating contact: ' + error.message);
    }
  }

  async deleteOneContact(data: DeleteContactDto) {
    try {
      const contactExists = await this.prisma.contacts.findFirst({
        where: {
          id: data.id,
        },
      });
      if (!contactExists) {
        throw new NotFoundException(`Contact not found`);
      }

      await this.prisma.contacts.delete({
        where: {
          id: data.id,
        },
      });

      return {
        message: 'Contact deleted successfully',
      };
    } catch (error) {
      throw new Error('Error deleting contact: ' + error.message);
    }
  }
}
