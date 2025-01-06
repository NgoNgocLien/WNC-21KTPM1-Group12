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
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth')
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
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ status: HttpStatus.OK, description: 'Đăng nhập thành công' })
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
  @ApiResponse({ status: HttpStatus.OK, description: 'Đăng xuất thành công' })
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Req() req: Request) {
    return this.authService.logout(req.user['sub'], req.user['role']);
  }

  @ApiBearerAuth('refresh-token')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Refresh token thành công',
  })
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
    status: HttpStatus.OK,
    description: 'Lấy thông tin tài khoản thành công',
  })
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
