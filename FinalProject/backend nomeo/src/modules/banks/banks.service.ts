import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
  } from '@nestjs/common';
  import { PrismaService } from 'src/common/prisma/prisma.service';
  
  @Injectable()
  export class BanksService {
    constructor(private readonly prisma: PrismaService) {}
  
    async getSecretKey(code: string) {
        const bank = await this.prisma.banks.findMany({
          where: {
            code,
          },
        });
            
        return bank ? bank[0].secret_key : null
    }
  
    async getPublicKey(code: string) {
        const bank = await this.prisma.banks.findMany({
            where: {
              code,
            },
          });
              
          return bank ? bank[0].public_key : null
    }

    async getPrivateKey(){
        return process.env.PRIVATE_KEY
    }
  }
  