import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import * as crypto from 'crypto';
import { BanksService } from 'src/modules/banks/banks.service';
import { ExternalTransactionPayload } from '../types/ExternalTransactionPayload';
import { AuthService } from '../auth.service';

@Injectable()
export class TransactionStrategy extends PassportStrategy(Strategy, 'transaction') {
  constructor(
    private readonly banksService: BanksService,
    private readonly authService: AuthService
  ) {
    super();
  }

  // Validate incoming request
  async validate(req: Request) {
    const bankCode = req.body['bankCode'] as string;
    const encryptedPayload = req.body['encryptedPayload'] as string;
    const hashPayload = req.body['hashPayload'] as string;
    const signature = req.body['signature'] as string;
  
    if (!encryptedPayload ||!hashPayload || !signature || !bankCode) {
      throw new UnauthorizedException('Missing required headers');
    }

    const bank = await this.banksService.getBank(bankCode);
    if (!bank) {
      throw new UnauthorizedException('Invalid bank');
    }

    if (!this.authService.verifyHash(encryptedPayload, bank.secret_key, hashPayload)){
      throw new UnauthorizedException('Invalid payload hash');
    }

    if (!this.authService.verifySignature(encryptedPayload, bank.rsa_public_key, signature)) {
      throw new UnauthorizedException('Invalid signature');
    }

    const privateKey = process.env.RSA_PRIVATE_KEY;
    if (!privateKey) {
      throw new UnauthorizedException('Server private key not found');
    }

    let payload: ExternalTransactionPayload;
    try {
      payload = this.authService.decryptData(encryptedPayload, privateKey);
    } catch (error) {
      throw new UnauthorizedException('Error decrypting payload');
    }
    
    console.log(payload)

    if (!this.authService.verifyTimestamp(payload.timestamp as string)){
      throw new UnauthorizedException('Request has expired');
    }

    

    return {
      bank_code: bankCode,
      signature,
      payload,
    };
  }
}
