import { Injectable } from '@nestjs/common';
import { CreateDebtDto } from './dto/createDebt.dto';
import { UpdateDebtDto } from './dto/updateDebt.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DebtsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createDebtDto: CreateDebtDto) {
    return this.prisma.debts.create({
      data: createDebtDto,
    });
  }

  findAll() {
    return this.prisma.debts.findMany();
  }

  findOutgoing(id: number) {
    // join with customers table to get debtor details
    return this.prisma.debts.findMany({
      where: {
        id_creditor: id,
      },
      include: {
        debtor: {
          select: {
            id: true,
            username: true,
            fullname: true,
          },
        },
      },
    });
  }

  findIncoming(id: number) {
    // join with customers table to get creditor details
    return this.prisma.debts.findMany({
      where: {
        id_debtor: id,
      },
      include: {
        creditor: {
          select: {
            id: true,
            username: true,
            fullname: true,
          },
        },
      },
    });
  }

  update(id: number, updateDebtDto: UpdateDebtDto) {
    return this.prisma.debts.update({
      where: {
        id: id,
      },
      data: updateDebtDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} debt`;
  }
}
