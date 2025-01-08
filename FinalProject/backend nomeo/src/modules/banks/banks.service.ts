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
  
    async getBankByInternalCode(internal_code: string) {
        const bank = await this.prisma.banks.findMany({
          where: {
            internal_code,
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
        const encryptMethod = (external_bank.rsa_public_key) ? "RSA" : "PGP"
        const private_key = (external_bank.rsa_public_key) ? process.env.RSA_PRIVATE_KEY : process.env.PGP_PRIVATE_KEY
        const public_key = external_bank.rsa_public_key || external_bank.pgp_public_key
       
        const header = {
          hashMethod: 'sha256',
          timestamp: Date.now()
        }

        const encryptedPayload = await this.authService.encryptData(data, public_key, encryptMethod)
        const integrity = this.authService.hashPayload(JSON.stringify(header) + encryptedPayload, external_bank.secret_key)

        // console.log(JSON.stringify(header) + encryptedPayload)
        const signature = await this.authService.createSignature(
          JSON.stringify(header) + encryptedPayload, 
          private_key, 
          encryptMethod)

        // console.log(signature)

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            header,
            encryptedPayload,
            integrity,
            signature,
          }),
        });

        // console.log(response)
        
        if (!response.ok) {
          const error = await response.json();
          console.error('Error:', error);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const dataResponse = await response.json();
        let decryptedPayload = null;
        try {
          decryptedPayload = await this.authService.decryptData(dataResponse.encryptedPayload, private_key, encryptMethod);
          console.log(decryptedPayload)

          if (decryptedPayload.statusCode === 200){
            return {sender_signature:signature, recipient_signature: dataResponse.signature};
          //   if (!this.authService.verifyHash(response.data.encryptedPayload, external_bank.secret_key, decryptedPayload.integrity)){
          //     throw new UnauthorizedException('Invalid payload hash');
          //   }
            
          //   const validSignature = await this.authService.verifySignature(response.data.encryptedPayload, public_key, response.data.signature, encryptMethod)
          //   if (!validSignature) {
          //     throw new UnauthorizedException('Invalid signature');
          //   }
          } else {
            throw new Error("Error in creating transaction in external server")
          }
          } catch (error) {
          // console.log(error)
          throw new UnauthorizedException('Error decrypting payload');
        }

        
      } catch (error) {
        console.error('Error calling external API:', error.message);
        throw error; // Nếu cần xử lý lỗi ở nơi khác
      }
    }

    async getExternalFullname(account_number: string, external_bank: any, url: string){
      try {
        const encryptMethod = (external_bank.rsa_public_key) ? "RSA" : "PGP"
        const public_key = external_bank.rsa_public_key || external_bank.pgp_public_key

        const payload = {
          fromBankCode: external_bank.external_code, 
          accountNumber: account_number
        }
        const header = {
          hashMethod: 'sha256',
          timestamp: Date.now()
        }

        const encryptedPayload = await this.authService.encryptData(JSON.stringify(payload), public_key, encryptMethod )
      
        const integrity = this.authService.hashPayload(JSON.stringify(header) + encryptedPayload, external_bank.secret_key)

        const response = await axios.post(url, {
          header,
          encryptedPayload,
          integrity,
        });

        let decryptedPayload = null;
        try {
          const private_key = (encryptMethod == "PGP") ? process.env.PGP_PRIVATE_KEY : process.env.RSA_PRIVATE_KEY
          decryptedPayload = await this.authService.decryptData(response.data.encryptedPayload, private_key, encryptMethod);
          const fullname = decryptedPayload.data.customer.full_name;
          return fullname;

        } catch (error) {
          throw new UnauthorizedException('Error decrypting payload');
        }
      } catch (error) {
        console.error('Error calling external API:', error.message);
        throw error; // Nếu cần xử lý lỗi ở nơi khác
      }
    }

    async generateExternalResponseData(data: string, external_bank: any, encryptMethod: string): Promise<ExternalTransactionResponse>{
      const private_key = (encryptMethod == "PGP") ? process.env.PGP_PRIVATE_KEY : process.env.RSA_PRIVATE_KEY
      const public_key = (encryptMethod == "PGP") ? external_bank.pgp_public_key : external_bank.rsa_public_key
      const encryptedPayload = await this.authService.encryptData(data, public_key, encryptMethod);
      const signature = await this.authService.createSignature(encryptedPayload, private_key, encryptMethod)
      return {
        encryptedPayload,
        signature
      }
    }
  }
  