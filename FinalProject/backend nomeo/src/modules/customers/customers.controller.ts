import {
  Controller,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Get,
  Inject, LoggerService,
  Patch,
  Delete
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { CustomersService } from './customers.service';
import { Request } from 'express';
import { CreateContactDto } from './dto/createContact.dto';
import { UpdateContactDto } from './dto/updateContact.dto';
import { DeleteContactDto } from './dto/deleteContact.dto';
import { CreateCustomerDto } from './dto/createCustomer.dto';

@Controller('customers')
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get('')
  getAllCustomers() {
    return this.customersService.getAllCustomers();
  }

  @HttpCode(HttpStatus.OK)
  @Get('profile')
  getCustomerProfile(@Req() req: Request) {
    return this.customersService.getProfile(req.user['sub']);
  }

  @HttpCode(HttpStatus.OK)
  @Get('accounts')
  getAllAccounts(@Req() req: Request) {
    return this.customersService.getAllAccounts(req.user['sub']);
  }

  @HttpCode(HttpStatus.OK)
  @Post('')
  createOneCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.createOneCustomer(createCustomerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('contacts')
  getAllContacts(@Req() req: Request) {
    return this.customersService.getAllContacts(req.user['sub']);
  }

  @HttpCode(HttpStatus.OK)
  @Post('contacts')
  createOneContact(
    @Req() req: Request, 
    @Body() body: CreateContactDto
  ) {
    return this.customersService.createOneContact({
      id_customer: req.user['sub'],
      ...body
    });
  }

  @HttpCode(HttpStatus.OK)
  @Patch('contacts')
  updateOneContact(
    @Req() req: Request,
    @Body() body: UpdateContactDto
  ) {
    return this.customersService.updateOneContact(req.user['sub'], body);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('contacts')
  deleteOneContact(@Body() body: DeleteContactDto) {
    return this.customersService.deleteOneContact(body);
  }

}
