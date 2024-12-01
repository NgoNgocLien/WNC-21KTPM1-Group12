import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HttpCode, HttpStatus } from '@nestjs/common';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() body: { username: string; password: string }) {
    return this.authService.login(body.username, body.password);
  }
}
