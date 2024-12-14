import {
  Controller,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Get,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Request } from 'express';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

//   @HttpCode(HttpStatus.OK)
//   @Get('')
//   getAllCustomers() {
//     return this.customersService.getAllCustomers();
//   }

//   @HttpCode(HttpStatus.OK)
//   @Get('profile')
//   getCustomerProfile() {
//     return this.customersService.getCustomerProfile();
//   }

//   @HttpCode(HttpStatus.OK)
//   @Get('accounts')
//   getAllAccounts() {
//     return this.customersService.getAllAccounts();
//   }

//   @HttpCode(HttpStatus.OK)
//   @Post('')
//   createOneCustomer(@Body() body: { username: string; password: string }) {
//     return this.customersService.createOneCustomer(body.username, body.password);
//   }

//   @HttpCode(HttpStatus.OK)
//   @Patch('')
//   updateOneCustomer(@Body() body: { username: string; password: string }) {
//     return this.customersService.updateOneCustomer();
//   }

//   @HttpCode(HttpStatus.OK)
//   @Get('contacts')
//   getAllContacts() {
//     return this.customersService.getAllContacts();
//   }

//   @HttpCode(HttpStatus.OK)
//   @Post('contacts')
//   createOneContact(@Body() body: { username: string; password: string }) {
//     return this.customersService.createOneContact(body.username, body.password);
//   }

//   @HttpCode(HttpStatus.OK)
//   @Patch('contacts')
//   updateOneContact(@Body() body: { username: string; password: string }) {
//     return this.customersService.updateOneContact();
//   }

//   @HttpCode(HttpStatus.OK)
//   @Delete('contacts')
//   deleteOneContact() {
//     return this.customersService.deleteOneContact();
//   }

//   @HttpCode(HttpStatus.OK)
//   @Post('transaction/internal')
//   createOneInternalTransaction(@Body() body: { username: string; password: string }) {
//     return this.customersService.createOneInternalTransaction(body.username, body.password);
//   }

//   @HttpCode(HttpStatus.OK)
//   @Post('transaction/external')
//   createOneExternalTransaction(@Body() body: { username: string; password: string }) {
//     return this.customersService.createOneExternalTransaction(body.username, body.password);
//   }

}
