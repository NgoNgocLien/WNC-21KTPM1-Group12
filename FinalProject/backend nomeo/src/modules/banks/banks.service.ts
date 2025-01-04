import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
  } from '@nestjs/common';
  import { PrismaService } from 'src/common/prisma/prisma.service';
  import axios from 'axios';
import { AuthService } from '../auth/auth.service';

  @Injectable()
  export class BanksService {
    constructor(
      private readonly prisma: PrismaService,
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
        const payload =  this.authService.encryptData(data, external_bank.public_key)
        const integrity = this.authService.hashPayload(payload, external_bank.secret_key)
        const signature = this.authService.createSignature(payload, process.env.RSA_PRIVATE_KEY)
        const response = await axios.post(url, {
          body:{
            payload,
            integrity,
            signature
          }
        });

        return response;
      } catch (error) {
        console.error('Error calling external API:', error.message);
        throw error; // Nếu cần xử lý lỗi ở nơi khác
      }
    }
  }
  