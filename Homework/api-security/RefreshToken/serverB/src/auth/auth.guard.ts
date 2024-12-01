import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const time = request.headers['x-timestamp'];
    const signature = request.headers['x-signature'];

    if (!time || !signature) {
      return false;
    }

    const currentTime = new Date().getTime();
    const requestTime = new Date(time).getTime();
    // If the request is older than 5 minutes, reject it
    if (currentTime - requestTime > 60 * 5 * 1000) {
      return false;
    }

    const signatureToCheck = `${request.method}${request.url}${time}${process.env.SECRET_KEY}`;
    const hash = crypto
      .createHash('sha256')
      .update(signatureToCheck)
      .digest('hex');

    console.log(time, signatureToCheck);

    return hash === signature;
  }
}
