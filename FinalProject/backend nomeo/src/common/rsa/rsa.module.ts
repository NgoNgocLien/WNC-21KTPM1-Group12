import { Module } from '@nestjs/common';
import { RsaService } from './rsa.service';
import { RsaController } from './rsa.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [RsaController],
  providers: [RsaService, PrismaService],
})
export class RsaModule {}
