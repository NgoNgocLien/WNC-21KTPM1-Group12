import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import * as crypto from 'crypto';
import { BanksService } from 'src/modules/banks/banks.service';
import { AuthService } from '../auth.service';

@Injectable()
export class CustomerInfoStrategy extends PassportStrategy(Strategy, 'customer-info') {
  constructor(
    private readonly banksService: BanksService,
    private readonly authService: AuthService
  ) {
    super();
  }

  async validate(req: Request) {
    const payloadHash = req.body['hashedPayload'] as string;
    const bankCode = req.body['bankCode'] as string;
    const timestamp = req.body['timestamp'] as string;
    const accountNumber = req.body['accountNumber'] as string;

    if (!bankCode || !payloadHash || !timestamp || !accountNumber) {
      throw new UnauthorizedException('Missing required info');
    }

    const bank = await this.banksService.getBank(bankCode);
    if (!bank) {
      throw new UnauthorizedException('Invalid bank');
    }


    if (!this.authService.verifyTimestamp(timestamp)){
      throw new UnauthorizedException('Request has expired');
    }

    if (this.authService.verifyHash(accountNumber + timestamp, bank.secret_key, payloadHash)){
      throw new UnauthorizedException('Invalid payload hash');
    }

    return { 
      account_number: accountNumber 
    };
  }
}