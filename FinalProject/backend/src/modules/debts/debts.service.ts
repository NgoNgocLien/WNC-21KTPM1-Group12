import { Injectable } from '@nestjs/common';
import { CreateDebtDto } from './dto/createDebt.dto';
import { UpdateDebtDto } from './dto/updateDebt.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { DeleteDebtDto } from './dto/deleteDebt.dto';
import { PayDebtDto } from './dto/payDebt.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class DebtsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDebtDto: CreateDebtDto) {
    try {
      const debt = await this.prisma.debts.create({
        data: createDebtDto,
      });

      return {
        message: 'Debt created successfully',
        data: debt,
      };
    } catch (error) {
      throw new Error('Error creating debt: ' + error.message);
    }
  }

  async findAll() {
    try {
      const debts = await this.prisma.debts.findMany();

      return {
        message: 'Debts fetched successfully',
        data: debts,
      };
    } catch (error) {
      throw new Error('Error fetching debts: ' + error.message);
    }
  }

  async findOne(id: number) {
    try {
      const debt = await this.prisma.debts.findUnique({
        where: {
          id,
        },
      });

      return {
        message: 'Debt fetched successfully',
        data: debt,
      };
    } catch (error) {
      throw new Error('Error fetching debt: ' + error.message);
    }
  }

  async findOutgoing(id_customer: number) {
    try {
      const debts = await this.prisma.debts.findMany({
        where: {
          id_creditor: id_customer,
        },
        include: {
          // join with customers table to get debtor details
          debtor: {
            select: {
              id: true,
              username: true,
              fullname: true,
            },
          },
        },
      });

      return {
        message: 'Outgoing debts fetched successfully',
        data: debts,
      };
    } catch (error) {
      throw new Error('Error fetching outgoing debts: ' + error.message);
    }
  }

  async findIncoming(id_customer: number) {
    try {
      const debts = await this.prisma.debts.findMany({
        where: {
          id_debtor: id_customer,
        },
        include: {
          // join with customers table to get creditor details
          creditor: {
            select: {
              id: true,
              username: true,
              fullname: true,
            },
          },
        },
      });

      return {
        message: 'Incoming debts fetched successfully',
        data: debts,
      };
    } catch (error) {
      throw new Error('Error fetching incoming debts: ' + error.message);
    }
  }

  async deleteDebt(id: number, deleteDebtDto: DeleteDebtDto) {
    try {
      const [debt, debtDeletion] = await this.prisma.$transaction([
        this.prisma.debts.update({
          where: {
            id,
          },
          data: { status: 'DELETED' },
        }),
        this.prisma.debt_deletions.create({
          data: {
            id_debt: id,
            ...deleteDebtDto,
          },
        }),
      ]);

      // SEND NOTIFICATION TO DEBTOR AND CREDITOR
      return {
        message: 'Debt deleted successfully',
        data: {
          debt,
          debtDeletion,
        },
      };
    } catch (error) {
      switch (error.code) {
        case 'P2025':
          throw new Error('Debt not found');
        case 'P2002':
          throw new Error('Debt already deleted');
        case undefined:
          throw new Error('Deleter must be the creditor or debtor');
        default:
          throw new Error(
            'Error deleting debt: ' + error.code + ' - ' + error.message,
          );
      }
    }
  }

  async payDebt(id: number, payDebtDto: PayDebtDto) {
    try {
      const [debt, debtPayment] = await this.prisma.$transaction([
        this.prisma.debts.update({
          where: {
            id,
          },
          data: { status: 'PAID' },
        }),
        this.prisma.debt_payments.create({
          data: {
            id_debt: id,
            id_transaction: payDebtDto.id_transaction,
          },
        }),
      ]);

      // SEND NOTIFICATION TO DEBTOR AND CREDITOR
      return {
        message: 'Debt paid successfully',
        data: {
          debt,
          debtPayment,
        },
      };
    } catch (error) {
      throw new Error('Error paying debt: ' + error.message);
    }
  }
}
