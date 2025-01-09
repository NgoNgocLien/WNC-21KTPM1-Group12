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
import { VerifyCaptchaDto } from './dto/verifyCaptcha';

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

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Đăng nhập thành công',
    schema: {
      description: 'Access token và refresh token được trả về',
      example: {
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      },
    },
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Đăng xuất thành công',
    schema: {
      description: 'Xóa refresh token và FCM token khỏi hệ thống',
      example: {
        message: 'Logout success',
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Req() req: Request) {
    return this.authService.logout(req.user['sub'], req.user['role']);
  }

  @ApiBearerAuth('refresh-token')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Refresh token thành công',
    schema: {
      description: 'Access token và refresh token mới được trả về',
      example: {
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      },
    },
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
    description: 'Đóng tài khoản thành công',
    schema: {
      description: 'Cập nhật trạng thái tài khoản thành inactive',
      example: {
        message: 'Account deactivated',
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post('deactivate')
  deactivate(@Req() req: Request) {
    return this.authService.deactivate(req.user['sub'], req.user['role']);
  }

  @ApiExcludeEndpoint()
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Giải mã access token',
  })
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Xác thực captcha thành công',
    schema: {
      description: 'Trả về kết quả xác thực captcha',
      example: true,
    },
  })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('verify-recaptcha')
  verifyRecaptcha(@Body() verifyCaptchaDto: VerifyCaptchaDto) {
    return this.authService.verifyRecaptcha(verifyCaptchaDto.token);
  }
}
