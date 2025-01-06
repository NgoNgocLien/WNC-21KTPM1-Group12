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
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import { Request } from 'express';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { LoginDto } from './dto/login.dto';
import { Http } from 'winston/lib/winston/transports';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ status: 200, description: 'Đăng nhập thành công' })
  @ApiResponse({ status: 401, description: 'Đăng nhập thất bại' })
  @ApiResponse({
    status: 400,
    description: 'Yêu cầu không hợp lệ',
    links: null,
  })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(
      loginDto.username,
      loginDto.password,
      loginDto.role,
      loginDto.fcm_token,
    );
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Đăng xuất thành công' })
  @ApiResponse({ status: 401, description: 'Đăng xuất thất bại' })
  @ApiResponse({ status: 400, description: 'Yêu cầu không hợp lệ' })
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Req() req: Request) {
    return this.authService.logout(req.user['sub'], req.user['role']);
  }

  @ApiBearerAuth('refresh-token')
  @ApiResponse({ status: 200, description: 'Refresh token thành công' })
  @ApiResponse({ status: 401, description: 'Refresh token thất bại' })
  @ApiResponse({ status: 400, description: 'Yêu cầu không hợp lệ' })
  @Public()
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refresh(@Req() req: Request) {
    return this.authService.refresh(
      req.user['sub'],
      req.user['refresh_token'],
      req.user['role'],
    );
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin tài khoản thành công',
  })
  @ApiResponse({ status: 401, description: 'Lấy thông tin tài khoản thất bại' })
  @ApiResponse({ status: 400, description: 'Yêu cầu không hợp lệ' })
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }

  @ApiExcludeEndpoint()
  @Public()
  @Post('verify-recaptcha')
  verifyRecaptcha(@Body() body: { token: string }) {
    return this.authService.verifyRecaptcha(body.token);
  }
}
