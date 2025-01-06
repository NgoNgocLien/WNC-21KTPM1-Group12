import {
    forwardRef,
    Inject,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import axios from 'axios';
import { AuthService } from '../auth/auth.service';

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
        const payload =  this.authService.encryptData(data + timestamp, external_bank.rsa_public_key)
        const integrity = this.authService.hashPayload(payload, external_bank.secret_key)
        const signature = this.authService.createSignature(payload, process.env.RSA_PRIVATE_KEY)
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
          decryptedPayload = this.authService.decryptData(response.data.encryptedPayload, process.env.RSA_PRIVATE_KEY);
        } catch (error) {
          throw new UnauthorizedException('Error decrypting payload');
        }

        if (decryptedPayload.statusCode === 200){
          if (!this.authService.verifyHash(response.data.encryptedPayload, external_bank.secret_key, decryptedPayload.integrity)){
            throw new UnauthorizedException('Invalid payload hash');
          }
      
          if (!this.authService.verifySignature(response.data.encryptedPayload, external_bank.rsa_public_key, response.data.signature)) {
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
          const payload =  this.authService.encryptData(data + timestamp, external_bank.rsa_public_key)
          const integrity = this.authService.hashPayload(payload, external_bank.secret_key)
          const signature = this.authService.createSignature(payload, process.env.RSA_PRIVATE_KEY)

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
            decryptedPayload = this.authService.decryptData(response.data.encryptedPayload, process.env.RSA_PRIVATE_KEY);
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
  }
  