import {
    forwardRef,
    Inject,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import axios from 'axios';
import { AuthService } from '../auth/auth.service';
import { ExternalTransactionResponse } from '../auth/types/ExternalTransactionResponse';

  @Injectable()
  export class BanksService {
    constructor(
      private readonly prisma: PrismaService,
      @Inject(forwardRef(() => AuthService))
      private readonly authService: AuthService
    ) {}
  
    async getBankByCode(code: string) {
        const bank = await this.prisma.banks.findMany({
          where: {
            code,
          },
        });
            
        return bank ? bank[0]: null
    }

    async getBankById(id: number) {
      const bank = await this.prisma.banks.findUnique({
        where: {
          id,
        },
      });
          
      return bank
    }

    async makeTransaction(data: string, external_bank: any, url: string){
      try {
        const timestamp = Math.floor(Date.now() / 1000).toString()
        const encryptMethod = (external_bank.rsa_public_key) ? "RSA" : "PGP"
        const private_key = (external_bank.rsa_public_key) ? process.env.RSA_PRIVATE_KEY : process.env.PGP_PRIVATE_KEY
        const public_key = external_bank.rsa_public_key || external_bank.pgp_public_key

        const payload = await this.authService.encryptData(data + timestamp, public_key, encryptMethod)
        const integrity = this.authService.hashPayload(payload, external_bank.secret_key)
        const signature = await this.authService.createSignature(payload, private_key, encryptMethod)
        const response = await axios.post(url, {
          body:{
            header:{
              timestamp
            },
            encryptedPayload: payload,
            integrity,
            signature
          }
        });

        let decryptedPayload = null;
        try {
          decryptedPayload = await this.authService.decryptData(response.data.encryptedPayload, private_key, encryptMethod);
        } catch (error) {
          throw new UnauthorizedException('Error decrypting payload');
        }

        if (decryptedPayload.statusCode === 200){
          if (!this.authService.verifyHash(response.data.encryptedPayload, external_bank.secret_key, decryptedPayload.integrity)){
            throw new UnauthorizedException('Invalid payload hash');
          }
          
          const validSignature = await this.authService.verifySignature(response.data.encryptedPayload, public_key, response.data.signature, encryptMethod)
          if (!validSignature) {
            throw new UnauthorizedException('Invalid signature');
          }
        } else {
          throw new Error("Error in creating transaction in external server")
        }

        return {sender_signature:signature, recipient_signature: response.data.signature};
      } catch (error) {
        console.error('Error calling external API:', error.message);
        throw error; // Nếu cần xử lý lỗi ở nơi khác
      }
    }

    async getExternalFullname(data: string, external_bank: any, url: string){
      try {

        const timestamp = Math.floor(Date.now() / 1000).toString()
        const encryptMethod = (external_bank.rsa_public_key) ? "RSA" : "PGP"
        const private_key = (external_bank.rsa_public_key) ? process.env.RSA_PRIVATE_KEY : process.env.PGP_PRIVATE_KEY
        const public_key = external_bank.rsa_public_key || external_bank.pgp_public_key

        const payload = await this.authService.encryptData(data + timestamp, public_key,encryptMethod)
        const integrity = this.authService.hashPayload(payload, external_bank.secret_key)
        const signature = await this.authService.createSignature(payload, private_key, encryptMethod)

        const response = await axios.post(url, {
          body:{
            header:{
              timestamp
            },
            encryptedPayload: payload,
            integrity,
            signature
          }
        });

        let decryptedPayload = null;
        try {
          decryptedPayload = await this.authService.decryptData(response.data.encryptedPayload, private_key, encryptMethod);
        } catch (error) {
          throw new UnauthorizedException('Error decrypting payload');
        }

        const fullname = decryptedPayload.data.customer.fullname;

        return fullname;
      } catch (error) {
        console.error('Error calling external API:', error.message);
        throw error; // Nếu cần xử lý lỗi ở nơi khác
      }
    }

    async generateExternalResponseData(data: string, external_bank: any, encryptMethod: string): Promise<ExternalTransactionResponse>{
      const private_key = (encryptMethod == "PGP") ? process.env.PGP_PRIVATE_KEY : process.env.RSA_PRIVATE_KEY
      const public_key = (encryptMethod == "PGP") ? external_bank.pgp_public_key : external_bank.rsa_public_key
      const encryptedData = await this.authService.encryptData(data, public_key, encryptMethod);
      // const hashData = this.authService.hashPayload(encryptedData, external_bank.secret_key);
      const signature = await this.authService.createSignature(encryptedData, private_key, encryptMethod)
      return {
        encryptedData,
        signature
      }
    }
  }
  