import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { AccessTokenGuard } from './guards/accessToken.guard';

@Module({
  imports: [UsersModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    {
      provide: 'APP_GUARD',
      useClass: AccessTokenGuard,
    },
  ],
})
export class AuthModule {}
