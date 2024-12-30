import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UpdateCustomerDto } from './dto/updateCustomer.dto';
import { CreateContactDto } from './dto/createContact.dto';
import { UpdateContactDto } from './dto/updateContact.dto';
import { DeleteContactDto } from './dto/deleteContact.dto';
import { CreateCustomerDto } from './dto/createCustomer.dto';
import { generateAccountNumber } from '../../common/utils/checksum.util';
const bcrypt = require('bcrypt');

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
      console.log(error.message)
      throw new InternalServerErrorException('Lỗi hệ thống');
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
      console.log(error.message)
      throw new InternalServerErrorException('Lỗi hệ thống');
    }
  }

  async findById(id: number) {
    try {
      const customer = await this.prisma.customers.findUnique({
        where: {
          id,
        },
      });

      return {
        message: 'Customer found successfully',
        data: customer,
      };
    } catch (error) {
      console.log(error.message)
      throw new InternalServerErrorException('Lỗi hệ thống');
    }
  }

  async getProfile(id: number) {
    try {
      const customer = await this.prisma.customers.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          fullname: true, // Only select the fullname field
          email: true,
          username: true,
          phone: true,
          fcm_token: true,
          accounts: {
            select: {
              account_number: true,
              account_balance: true,
            },
          },
        },
      });

      return {
        message: 'Customer found successfully',
        data: customer,
      };
    } catch (error) {
      console.log(error.message)
      throw new InternalServerErrorException('Lỗi hệ thống');
    }
  }

  
  async findInternalProfile(account_number: string){
    try{
      const profile = await this.prisma.accounts.findUnique({
        where:{
          account_number: account_number,
        },
        select:{
          account_number: true,
          customers: {
            select:{
              fullname: true
            }
          }
        }
      })

      return {
        message: "Profile fetched successfully",
        data: profile
      }
    } catch(error){
      // if (error instanceof NotFoundException || error instanceof ConflictException) {
      //   throw error;
      // }
      console.log(error.message)
      throw new InternalServerErrorException('Lỗi hệ thống');
    }
  }

  async findExternalProfile(account_number: string){
    try{
      const profile = await this.prisma.accounts.findUnique({
        where:{
          account_number: account_number,
        },
        select:{
          account_number: true,
          customers: {
            select:{
              fullname: true
            }
          }
        }
      })

      return {
        message: "Profile fetched successfully",
        data: profile
      }
    } catch(error){
      // if (error instanceof NotFoundException || error instanceof ConflictException) {
      //   throw error;
      // }
      console.log(error.message)
      throw new InternalServerErrorException('Lỗi hệ thống');
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

      const customer = await this.prisma.customers.update({
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
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.log(error.message)
      throw new InternalServerErrorException('Lỗi hệ thống');
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

      return {
        message: 'Customer and account created successfully',
        data: {
          customer,
          account,
        },
      };
    } catch (error) {
      console.log(error.message)
      throw new InternalServerErrorException('Lỗi hệ thống');
    }
  }

  async getAllAccounts(id: number) {
    try {
      const customerExists = await this.prisma.customers.findUnique({
        where: { id },
      });
      if (!customerExists) {
        throw new NotFoundException(`Khách hàng không tồn tại`);
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
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.log(error.message)
      throw new InternalServerErrorException('Lỗi hệ thống');
    }
  }

  async getAllContacts(id: number) {
    try {
      const customerExists = await this.prisma.customers.findUnique({
        where: { id },
      });
      if (!customerExists) {
        throw new NotFoundException(`Khách hàng không tồn tại`);
      }

      const contacts = await this.prisma.contacts.findMany({
        where: {
          id_customer: id,
        },
        select: {
          id: true,
          nickname: true,
          contact_account_number: true,
          contact_fullname: true,
          banks: {
            select: {
              name: true,
              logo: true,
            },
          },
        },
      });

      const transformedContacts = contacts
      .map((contact) => ({
        id: contact.id,
        nickname: contact.nickname,
        account_number: contact.contact_account_number,
        contact_fullname: contact.contact_fullname,
        bank_name: contact.banks.name,
        bank_logo: contact.banks.logo,
      }))
      .sort((a, b) => a.nickname.localeCompare(b.nickname));

      return {
        message: 'Contacts found successfully',
        data: transformedContacts,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.log(error.message)
      throw new InternalServerErrorException('Lỗi hệ thống');
    }
  }

  async createOneContact(data: CreateContactDto) {
    try {
      const customerExists = await this.prisma.customers.findUnique({
        where: { id: data.id_customer },
      });
      if (!customerExists) {
        throw new NotFoundException(`Khách hàng không tồn tại`);

      }

      const contactExists = await this.prisma.contacts.findFirst({
        where: {
          id_customer: data.id_customer,
          contact_account_number: data.contact_account_number,
        },
      });
      if (contactExists) {
        throw new ConflictException(`'Người nhận đã tồn tại'`);
      }

      const newContact = await this.prisma.contacts.create({
        data,
        include: {
          banks: {
            select: {
              name: true,
              logo: true,
            },
          },
        },
      });

      const transformedContact = {
        id: newContact.id,
        nickname: newContact.nickname,
        account_number: newContact.contact_account_number,
        contact_fullname: newContact.contact_fullname,
        bank_name: newContact.banks.name,
        bank_logo: newContact.banks.logo,
      };

      return {
        message: 'Thêm mới người nhận thành công',
        data: transformedContact,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      console.log(error.message)
      throw new InternalServerErrorException('Lỗi hệ thống');
    }
  }

  async updateOneContact(id_customer: number, data: UpdateContactDto) {
    try {
      const contactExists = await this.prisma.contacts.findFirst({
        where: {
          id: data.id,
          // contact_account_number: data.contact_account_number,
        },
      });
      if (!contactExists) {
        throw new NotFoundException(`Không tìm thấy người nhận đã lưu`);
      }

      await this.prisma.contacts.update({
        where: {
          id: data.id,
          // id_customer,
        },
        data: {
          nickname: data.nickname,
        },
      });

      return {
        message: 'Chỉnh sửa tên gợi nhớ thành công',
        data: data
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      console.log(error.message)
      throw new InternalServerErrorException('Lỗi hệ thống');
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
        throw new NotFoundException(`Không tìm thấy người nhận đã lưu`);
      }

      await this.prisma.contacts.delete({
        where: {
          id: data.id,
        },
      });

      return {
        message: 'Xóa người nhận thành công',
        data: {
          id: data.id,
        }
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.log(error.message)
      throw new InternalServerErrorException('Lỗi hệ thống');
    }
  }
}