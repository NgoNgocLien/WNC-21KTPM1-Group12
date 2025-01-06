import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import * as crypto from 'crypto';
import { BanksService } from 'src/modules/banks/banks.service';
import { AuthService } from '../auth.service';
import { CustomerInfoPayload } from '../types/CustomerInfoPayload';

@Injectable()
export class CustomerInfoStrategy extends PassportStrategy(Strategy, 'customer-info') {
  constructor(
    private readonly banksService: BanksService,
    private readonly authService: AuthService
  ) {
    super();
  }

  async validate(req: Request) {
    const encryptMethod = req.body['encryptMethod'] as string;
    const hashedPayload = req.body['hashedPayload'] as string;
    const encryptedPayload = req.body['encryptedPayload'] as string;

    if (!encryptedPayload || !hashedPayload) {
      throw new UnauthorizedException('Missing required info');
    }

    const privateKey = (encryptMethod == "PGP") ? process.env.PGP_PRIVATE_KEY :  process.env.RSA_PRIVATE_KEY;
    if (!privateKey) {
      throw new UnauthorizedException('Server private key not found');
    }

    let payload: CustomerInfoPayload;
    try {
      payload = await this.authService.decryptData(encryptedPayload, privateKey, encryptMethod);
    } catch (error) {
      throw new UnauthorizedException('Error decrypting payload');
    }

    const bank = await this.banksService.getBankByCode(payload.bank_code);
    if (!bank) {
      throw new UnauthorizedException('Invalid bank');
    }

    if (!this.authService.verifyTimestamp(payload.timestamp as string)){
      throw new UnauthorizedException('Request has expired');
    }


    if (!this.authService.verifyHash(encryptedPayload, bank.secret_key, hashedPayload)){
      throw new UnauthorizedException('Invalid payload hash');
    }

    return { 
      account_number: payload.account_number,
      bank,
      encryptMethod
    };
  }
}