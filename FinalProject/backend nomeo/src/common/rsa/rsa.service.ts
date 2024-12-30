import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class RsaService implements OnModuleInit {
  private privateKey: Buffer;

  constructor(private readonly prisma: PrismaService) {
    this.privateKey = Buffer.from(process.env.PRIVATE_KEY, 'base64');
  }

  async onModuleInit() {
    // Ensure the private key is loaded
    if (!this.privateKey) {
      throw new Error('Private key not found in environment variables');
    }
  }

  async getPublicKey(bank_id: number): Promise<Buffer> {
    const bank = await this.prisma.banks.findUnique({
      where: { id: bank_id },
    });

    if (!bank) {
      throw new Error(`Bank with id ${bank_id} not found`);
    }

    return Buffer.from(bank.public_key, 'base64');
  }

  async encrypt(data: string, bank_id: number): Promise<string> {
    const publicKey = await this.getPublicKey(bank_id);
    return crypto.publicEncrypt(publicKey, Buffer.from(data)).toString('base64');
  }

  decrypt(data: string): string {
    return crypto.privateDecrypt(this.privateKey, Buffer.from(data, 'base64')).toString();
  }
}
