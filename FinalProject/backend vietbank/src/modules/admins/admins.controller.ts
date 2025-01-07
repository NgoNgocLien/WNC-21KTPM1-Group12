import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/createAdmin.dto';
import { UpdateAdminDto } from './dto/updateAdmin.dto';
import { Request } from 'express';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Admins')
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
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tạo admin thành công',
  })
  @HttpCode(HttpStatus.OK)
  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminsService.create(createAdminDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy thông tin tất cả admin thành công',
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll() {
    return this.adminsService.findAll();
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy thông tin admin thành công',
  })
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  findOne(@Req() req: Request) {
    return this.adminsService.findById(req.user['sub']);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật admin thành công',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của admin',
    required: true,
    schema: {
      type: 'integer',
    },
  })
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    return this.adminsService.update(id, updateAdminDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Xóa admin thành công',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của admin',
    required: true,
    schema: {
      type: 'integer',
    },
  })
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.adminsService.remove(id);
  }
}
