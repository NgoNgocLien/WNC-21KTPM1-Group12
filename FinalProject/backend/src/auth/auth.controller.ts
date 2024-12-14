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
import { Public } from './decorators/public.decorator';
import { Request } from 'express';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { Role } from './types/Role';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(
      loginDto.username,
      loginDto.password,
      loginDto.role,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Req() req: Request) {
    return this.authService.logout(req.user['sub'], req.user['role']);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refresh(@Req() req: Request) {
    return this.authService.refresh(
      req.user['sub'],
      req.user['refreshToken'],
      req.user['role'],
    );
  }

  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
