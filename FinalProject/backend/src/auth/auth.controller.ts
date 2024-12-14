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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() body: { username: string; password: string; role: Role }) {
    return this.authService.login(body.username, body.password, body.role);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Req() req: Request, @Body() body: { role: Role }) {
    return this.authService.logout(req.user['sub'], body.role);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refresh(@Req() req: Request, @Body() body: { role: Role }) {
    return this.authService.refresh(
      req.user['sub'],
      req.user['refreshToken'],
      body.role,
    );
  }

  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
