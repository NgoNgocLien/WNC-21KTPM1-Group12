import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import * as crypto from 'crypto';
import { BanksService } from 'src/modules/banks/banks.service';

@Injectable()
export class RsaStrategy extends PassportStrategy(Strategy, 'rsa') {
  constructor(private readonly banksService: BanksService) {
    super();
  }

  async validate(req: Request) {
    const hashMethod = req.headers['hash-method'] as string;
    const payloadHash = req.headers['payload-hash'] as string;
    const bankCode = req.headers['bank-code'] as string;
    const timestamp = req.headers['timestamp'] as string;
    const payload = req.body.payload as string;
    const signature = req.body.signature as string;

    if (!bankCode || !payloadHash || !timestamp) {
      throw new UnauthorizedException('Missing required info');
    }

    console.log(payload)

    const secretKey = await this.banksService.getSecretKey(bankCode);
    if (!secretKey) {
      throw new UnauthorizedException('Invalid bank');
    }

    console.log(secretKey)

    const currentTime = Math.floor(Date.now() / 1000);
    const requestTime = parseInt(timestamp, 10);
    if (isNaN(requestTime) || (currentTime - requestTime) > 300) {
      throw new UnauthorizedException('Request has expired');
    }

    const expectedHash = crypto.createHmac(`${hashMethod || "sha256"}`, secretKey).update(payload + timestamp).digest('hex');
    if (expectedHash !== payloadHash) {
      throw new UnauthorizedException('Invalid payload hash');
    }

    if (signature && payload) {
      const publicKey = await this.banksService.getPublicKey(bankCode);
      const verify = crypto.createVerify('RSA-SHA256');
      verify.update(payload);
      const isVerified = verify.verify(publicKey, signature, 'base64');
      if (!isVerified) {
        throw new UnauthorizedException('Invalid signature');
      }
    }

    return { 
      req 
    };
  }
}
