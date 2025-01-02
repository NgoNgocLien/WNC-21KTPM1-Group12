import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import * as crypto from 'crypto';
import { BanksService } from 'src/modules/banks/banks.service';
import { ExternalTransactionPayload } from '../types/ExternalTransactionPayload';
import { decryptAESKeyWithRsa, decryptPayloadWithAES, verifySignature } from 'src/common/utils/decryptTransaction';

@Injectable()
export class TransactionStrategy extends PassportStrategy(Strategy, 'transaction') {
  constructor(private readonly banksService: BanksService) {
    super();
  }

  // Validate incoming request
  async validate(req: Request) {
    const encryptedPayload = req.body['encryptedPayload'] as string;
    const encryptedAESKey = req.body['encryptedAesKey'] as string;
    const timestamp = req.body['timestamp'] as string;
    const signature = req.body['signature'] as string;
    const iv = req.body['iv'] as string;
    const bankCode = req.body['bankCode'] as string;

    if (!encryptedPayload || !encryptedAESKey || !timestamp || !signature || !iv || !bankCode) {
      throw new UnauthorizedException('Missing required headers');
    }

    const bank = await this.banksService.getBank(bankCode);
    if (!bank) {
      throw new UnauthorizedException('Invalid bank');
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const requestTime = parseInt(timestamp, 10);
    if (isNaN(requestTime) || (currentTime - requestTime) > 300000) {
      throw new UnauthorizedException('Request has expired');
    }

    const isSignatureValid = verifySignature(encryptedPayload, timestamp, iv, signature, bank.secret_key);
    if (!isSignatureValid) {
      throw new UnauthorizedException('Invalid signature');
    }

    const privateKey = process.env.RSA_PRIVATE_KEY;
    if (!privateKey) {
      throw new UnauthorizedException('Server private key not found');
    }

    // Decrypt AES Key using RSA private key
    let aesKey: Buffer;
    try {
      aesKey = decryptAESKeyWithRsa(encryptedAESKey, privateKey);
    } catch (error) {
      throw new UnauthorizedException('Error decrypting AES key');
    }

    // Decrypt payload using AES key
    let payload: ExternalTransactionPayload;
    try {
      payload = decryptPayloadWithAES(encryptedPayload, aesKey, iv);
    } catch (error) {
      throw new UnauthorizedException('Error decrypting payload');
    }

    console.log(payload)
    return {
      bank_code: bankCode,
      signature,
      payload,
    };
  }
}
