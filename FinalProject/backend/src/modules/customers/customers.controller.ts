import {
  Controller,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Get,
  Inject,
  LoggerService,
  Patch,
  Delete,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CustomersService } from './customers.service';
import { Request } from 'express';
import { CreateContactDto } from './dto/createContact.dto';
import { UpdateContactDto } from './dto/updateContact.dto';
import { DeleteContactDto } from './dto/deleteContact.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get('')
  getAllCustomers() {
    return this.customersService.getAllCustomers();
  }

  @Get('profile')
  getCustomerProfile(@Req() req: Request) {
    return this.customersService.findById(req.user['sub']);
  }

  @Get('accounts')
  getAllAccounts(@Req() req: Request) {
    return this.customersService.getAllAccounts(req.user['sub']);
  }

  //   @HttpCode(HttpStatus.OK)
  //   @Post('')
  //   createOneCustomer(@Body() body: { }) {
  //     return this.customersService.createOneCustomer();
  //   }

  @HttpCode(HttpStatus.OK)
  @Get('contacts')
  getAllContacts(@Req() req: Request) {
    return this.customersService.getAllContacts(req.user['sub']);
  }

  @HttpCode(HttpStatus.OK)
  @Post('contacts')
  createOneContact(@Req() req: Request, @Body() body: CreateContactDto) {
    return this.customersService.createOneContact({
      id_customer: req.user['sub'],
      ...body,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Patch('contacts')
  updateOneContact(@Req() req: Request, @Body() body: UpdateContactDto) {
    return this.customersService.updateOneContact(req.user['sub'], body);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('contacts')
  deleteOneContact(@Body() body: DeleteContactDto) {
    return this.customersService.deleteOneContact(body);
  }

  // @HttpCode(HttpStatus.OK)
  // @Post('transaction/internal')
  // createOneInternalTransaction(@Body() ) {
  //   return this.customersService.createOneInternalTransaction(body.username, body.password);
  // }

  //   @HttpCode(HttpStatus.OK)
  //   @Post('transaction/external')
  //   createOneExternalTransaction(@Body() body: { username: string; password: string }) {
  //     return this.customersService.createOneExternalTransaction(body.username, body.password);
  //   }
}
