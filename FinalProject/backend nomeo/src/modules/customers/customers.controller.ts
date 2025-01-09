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
  Param,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CustomersService } from './customers.service';
import { Request } from 'express';
import { CreateContactDto } from './dto/createContact.dto';
import { UpdateContactDto } from './dto/updateContact.dto';
import { DeleteContactDto } from './dto/deleteContact.dto';
import { CreateCustomerDto } from './dto/createCustomer.dto';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';

@ApiTags('Customers')
@ApiBearerAuth('access-token')
@ApiResponse({
  status: HttpStatus.BAD_REQUEST,
  description: 'Yêu cầu không hợp lệ',
})
@ApiResponse({
  status: HttpStatus.UNAUTHORIZED,
  description: 'Không có quyền truy cập',
})
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Lỗi server',
})
@Controller('customers')
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy thông tin tất cả khách hàng thành công',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Lấy thông tin tất cả khách hàng thành công',
        },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
                example: 1,
              },
              username: {
                type: 'string',
                example: 'nguyenvana',
              },
              fullname: {
                type: 'string',
                example: 'Nguyễn Văn A',
              },
              email: {
                type: 'string',
                example: 'nguyenvana@gmail.com',
              },
              phone: {
                type: 'string',
                example: '0987654321',
              },
              status: {
                type: 'string',
                enum: ['ACTIVE', 'DELETED'],
                example: 'ACTIVE',
                description: 'Trạng thái của khách hàng. ' +
                             'ACTIVE: Tài khoản đang hoạt động, ' +
                             'DELETED: Tài khoản đã bị đóng.',
              },
              accounts: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    account_number: {
                      type: 'string',
                      example: 'ACC100000001',
                    },
                  },
                },
              }
            },
          },
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Get('')
  getAllCustomers() {
    return this.customersService.getAllCustomers();
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy thông tin khách hàng thành công',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Lấy thông tin khách hàng thành công',
        },
        data: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            username: {
              type: 'string',
              example: 'john_doe',
            },
            fullname: {
              type: 'string',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              example: 'myleoovls@gmail.com',
            },
            phone: {
              type: 'string',
              example: '1234567890',
            },
            fcm_token: {
              type: 'string',
              example: 'fcm_token',
            },
            accounts: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  account_number: {
                    type: 'string',
                    example: 'ACC123456789',
                  },
                  account_balance: {
                    type: 'string',
                    example: '86662033',
                  },
                },
              },
            },
          },
        },
      },
    }
    
  })
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  getCustomerProfile(@Req() req: Request) {
    return this.customersService.getProfile(req.user['sub']);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy thông tin khách hàng nội bộ thành công',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Lấy thông tin khách hàng nội bộ thành công',
        },
        data: {
          type: 'string',
          example: 'Ngô Ngọc Liên',
        },
      },
    }
    
  })
  @ApiParam({
    name: 'account_number',
    description: 'Số tài khoản khách hàng',
    required: true,
    example: 'ACC100000001',
  })
  @Get('/profile/internal/:account_number')
  findInternalProfile(@Param('account_number') account_number: string) {
    return this.customersService.findInternalProfile(account_number);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy thông tin khách hàng ngân hàng khác thành công',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Lấy thông tin khách hàng ngân hàng khác thành công',
        },
        data: {
          type: 'string',
          example: 'Nguyen Muoi Ba',
        },
      },
    }
    
  })
  @ApiParam({
    name: 'account_number',
    description: 'Số tài khoản khách hàng',
    required: true,
    example: 'A12345',
  })
  @ApiParam({
    name: 'bank_id',
    description: 'ID ngân hàng',
    required: true,
    example: 2,
  })
  @Get('profile/external/:bank_id/:account_number')
  findExternalProfile(
    @Param('account_number') account_number: string,
    @Param('bank_id') bank_id: string,
  ) {
    return this.customersService.findExternalProfile(Number(bank_id), account_number);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy thông tin tài khoản ngân hàng thành công',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Lấy thông tin tài khoản ngân hàng thành công',
        },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
                example: 1,
              },
              account_number: {
                type: 'string',
                example: 'ACC123456789',
              },
              account_balance: {
                type: 'string',
                example: '86662033',
              },
              id_customer: {
                type: 'integer',
                example: 1,
              },
            },
          },
        },
      },
    }
    
  })
  @HttpCode(HttpStatus.OK)
  @Get('accounts')
  getAllAccounts(@Req() req: Request) {
    return this.customersService.getAllAccounts(req.user['sub']);
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Tạo khách hàng thành công',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Thêm mới khách hàng và tài khoản thanh toán thành công',
        },
        data: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            username: {
              type: 'string',
              example: 'nguyenvana',
            },
            fullname: {
              type: 'string',
              example: 'Nguyễn Văn A',
            },
            email: {
              type: 'string',
              example: 'nguyenvana@gmail.com',
            },
            phone: {
              type: 'string',
              example: '0987654321',
            },
            status: {
              type: 'string',
              enum: ['ACTIVE', 'DELETED'],
              example: 'ACTIVE',
              description: 'Trạng thái của khách hàng. ' +
                           'ACTIVE: Tài khoản đang hoạt động, ' +
                           'DELETED: Tài khoản đã bị đóng.',
            },
            accounts: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  account_number: {
                    type: 'string',
                    example: 'ACC100000001',
                  },
                },
              },
            }
          },
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post()
  createOneCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.createOneCustomer(createCustomerDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy thông tin liên hệ thành công',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Lấy thông tin liên hệ thành công',
        },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
                example: 24,
              },
              nickname: {
                type: 'string',
                example: 'Nguyen 13',
              },
              account_number: {
                type: 'string',
                example: 'A12345',
              },
              contact_fullname: {
                type: 'string',
                example: 'Nguyen Muoi Ba',
              },
              bank_name: {
                type: 'string',
                example: 'TechBank',
              },
              bank_logo: {
                type: 'string',
                format: 'url',
                example: 'https://inkythuatso.com/uploads/thumbnails/800/2021/09/logo-techcombank-inkythuatso-10-15-17-50.jpg',
              },
            },
          },
        },
      },
    }
    
    
  })
  @HttpCode(HttpStatus.OK)
  @Get('contacts')
  getAllContacts(@Req() req: Request) {
    return this.customersService.getAllContacts(req.user['sub']);
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Lưu thông tin liên hệ thành công',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Thêm mới người nhận thành công',
        },
        data: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 26,
            },
            nickname: {
              type: 'string',
              example: 'Nguyễn Văn A',
            },
            account_number: {
              type: 'string',
              example: 'ACC100000001',
            },
            contact_fullname: {
              type: 'string',
              example: 'Nguyễn Văn A',
            },
            bank_name: {
              type: 'string',
              example: 'NoMeoBank',
            },
            bank_logo: {
              type: 'string',
              format: 'url',
              example: 'https://trumsiaz.com/upload/product/meonangluongmattroitrumsiaz-6135.jpg',
            },
          },
        },
      },
    }
    
  })
  @Post('contacts')
  createOneContact(@Req() req: Request, @Body() body: CreateContactDto) {
    return this.customersService.createOneContact({
      id_customer: req.user['sub'],
      ...body,
    });
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật thông tin liên hệ thành công',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Chỉnh sửa tên gợi nhớ thành công',
        },
        data: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 26,
            },
            nickname: {
              type: 'string',
              example: 'Văn A',
            },
          },
        },
      },
    }
    
  })
  @Patch('contacts')
  updateOneContact(@Req() req: Request, @Body() body: UpdateContactDto) {
    return this.customersService.updateOneContact(req.user['sub'], body);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Xóa thông tin liên hệ thành công',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Lấy thông tin liên hệ thành công',
        },
        data: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
              example: '1'
            }
            
          },
        },
      },
    }
    
  })
  @Delete('contacts')
  deleteOneContact(@Body() body: DeleteContactDto) {
    return this.customersService.deleteOneContact(body);
  }
}
