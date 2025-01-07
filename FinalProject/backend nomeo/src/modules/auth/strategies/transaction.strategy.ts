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
    const encryptMethod = req.body['encryptMethod'] as string;
    const encryptedPayload = req.body['encryptedPayload'] as string;
    const hashedPayload = req.body['hashedPayload'] as string;
    const signature = req.body['signature'] as string;
  
    if (!encryptedPayload ||!hashedPayload || !signature) {
      throw new UnauthorizedException('Missing required headers');
    }

    const privateKey = (encryptMethod == "PGP") ? process.env.PGP_PRIVATE_KEY :  process.env.RSA_PRIVATE_KEY;

    if (!privateKey) {
      throw new UnauthorizedException('Server private key not found');
    }

    let payload: ExternalTransactionPayload;
    try {
      payload = await this.authService.decryptData(encryptedPayload, privateKey, encryptMethod)
    } catch (error) {
      throw new UnauthorizedException('Error decrypting payload');
    }

    console.log(payload)
    
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

    const publicKey = (encryptMethod == "PGP") ? bank.pgp_public_key :  bank.rsa_public_key;
    const validSignature = await this.authService.verifySignature(encryptedPayload, publicKey, signature, encryptMethod)
    if (!validSignature) {
      throw new UnauthorizedException('Invalid signature');
    }

    return {
      signature,
      payload,
      encryptMethod
    };
  }
}
