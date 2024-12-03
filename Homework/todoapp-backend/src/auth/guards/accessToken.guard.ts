import { AuthGuard } from '@nestjs/passport';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    } else {
      // perform the default behavior of the guard
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      
      if (token) {
        try {
          const decoded = await this.jwtService.verifyAsync(token, {
            secret: process.env.JWT_ACCESS_SECRET,
          });
          request.user = decoded; 
        } catch (e) {
          return false;
        }
      }
      
      return super.canActivate(context) as boolean;
    }
  }

  private extractTokenFromHeader(request: any): string | null {
    const authHeader = request.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7); // Lấy phần token
    }
    return null;
  }
}
