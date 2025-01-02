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
  
    async getBank(code: string) {
        const bank = await this.prisma.banks.findMany({
          where: {
            code,
          },
        });
            
        return bank ? bank[0]: null
    }
  }
  