import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateDebtDto } from './dto/createDebt.dto';
import { UpdateDebtDto } from './dto/updateDebt.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { DeleteDebtDto } from './dto/deleteDebt.dto';
import { PayDebtDto } from './dto/payDebt.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { debt_status } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class DebtsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationsService,
  ) {}

  async create(createDebtDto: CreateDebtDto) {
    try {
      const debtor = await this.prisma.accounts.findUnique({
        where: {
          account_number: createDebtDto.debtor_account_number,
        },
        select: {
          id_customer: true,
        },
      });

      const debt = await this.prisma.debts.create({
        data: {
          id_creditor: createDebtDto.id_creditor,
          id_debtor: debtor.id_customer,
          debt_amount: createDebtDto.debt_amount,
          debt_message: createDebtDto.debt_message,
        },
      });

      return {
        message: 'Debt created successfully',
        data: debt,
      };
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Lỗi hệ thống');
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
      console.log(error.message);
      throw new InternalServerErrorException('Lỗi hệ thống');
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
      console.log(error.message);
      throw new InternalServerErrorException('Lỗi hệ thống');
    }
  }

  async findOutgoing(id_customer: number) {
    try {
      const [pendingDebts, completedDebts] = await this.prisma.$transaction([
        this.prisma.debts.findMany({
          where: {
            id_creditor: id_customer,
            status: 'PENDING',
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
        }),
        this.prisma.debts.findMany({
          where: {
            OR: [
              {
                id_creditor: id_customer,
                status: debt_status.PAID,
              },
              {
                id_creditor: id_customer,
                status: debt_status.CANCELED,
              },
              {
                id_creditor: id_customer,
                status: debt_status.DECLINED,
              },
            ],
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
        }),
      ]);

      return {
        message: 'Outgoing debts fetched successfully',
        data: {
          pending: pendingDebts,
          completed: completedDebts,
        },
      };
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Lỗi hệ thống');
    }
  }

  async findIncoming(id_customer: number) {
    try {
      const [pendingDebts, completedDebts] = await this.prisma.$transaction([
        this.prisma.debts.findMany({
          where: {
            id_debtor: id_customer,
            status: 'PENDING',
          },
          include: {
            // join with customers table to get creditor details
            creditor: {
              select: {
                id: true,
                username: true,
                fullname: true,
                accounts: {
                  select: {
                    account_number: true,
                  },
                },
              },
            },
          },
        }),
        this.prisma.debts.findMany({
          where: {
            OR: [
              {
                id_debtor: id_customer,
                status: debt_status.PAID,
              },
              {
                id_debtor: id_customer,
                status: debt_status.CANCELED,
              },
              {
                id_debtor: id_customer,
                status: debt_status.DECLINED,
              },
            ],
          },
          include: {
            // join with customers table to get creditor details
            creditor: {
              select: {
                id: true,
                username: true,
                fullname: true,
                accounts: {
                  select: {
                    account_number: true,
                  },
                },
              },
            },
          },
        }),
      ]);

      return {
        message: 'Incoming debts fetched successfully',
        data: {
          pending: pendingDebts,
          completed: completedDebts,
        },
      };
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Lỗi hệ thống');
    }
  }

  async findPending(id_customer: number) {
    try {
      const debts = await this.prisma.debts.findMany({
        where: {
          OR: [
            {
              id_creditor: id_customer,
              status: debt_status.PENDING,
            },
            {
              id_debtor: id_customer,
              status: debt_status.PENDING,
            },
          ],
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
        message: 'Pending debts fetched successfully',
        data: debts,
      };
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Lỗi hệ thống');
    }
  }

  async findCompleted(id_customer: number) {
    try {
      const debts = await this.prisma.debts.findMany({
        where: {
          OR: [
            {
              id_creditor: id_customer,
              status: debt_status.PAID,
            },
            {
              id_debtor: id_customer,
              status: debt_status.PAID,
            },
            {
              id_creditor: id_customer,
              status: debt_status.CANCELED,
            },
            {
              id_debtor: id_customer,
              status: debt_status.CANCELED,
            },
            {
              id_creditor: id_customer,
              status: debt_status.DECLINED,
            },
            {
              id_debtor: id_customer,
              status: debt_status.DECLINED,
            },
          ],
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
        message: 'Completed debts fetched successfully',
        data: debts,
      };
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Lỗi hệ thống');
    }
  }

  async cancelDebt(
    id: number,
    fcm_token: string,
    deleteDebtDto: DeleteDebtDto,
  ) {
    try {
      const [debt, debtDeletion] = await this.prisma.$transaction([
        this.prisma.debts.update({
          where: {
            id,
          },
          data: { status: debt_status.CANCELED },
        }),
        this.prisma.debt_deletions.create({
          data: {
            id_debt: id,
            ...deleteDebtDto,
          },
        }),
      ]);

      // SEND NOTIFICATION TO DEBTOR AND CREDITOR
      this.notificationService.sendNotification(
        'Debt Canceled',
        'Your debt has been canceled',
        fcm_token,
      );

      return {
        message: 'Debt canceled successfully',
        data: {
          debt,
          debtDeletion,
        },
      };
    } catch (error) {
      switch (error.code) {
        case 'P2025':
          throw new PrismaClientKnownRequestError('Debt not found', {
            code: 'P2025',
            clientVersion: '2.20.0',
          });
        case 'P2002':
          throw new PrismaClientKnownRequestError('Debt already deleted', {
            code: 'P2002',
            clientVersion: '2.20.0',
          });
        case undefined:
          throw new PrismaClientKnownRequestError(
            'Deleter must be the creditor or debtor',
            {
              code: 'P0001',
              clientVersion: '2.20.0',
            },
          );
        default:
          throw new Error(
            'Error deleting debt: ' + error.code + ' - ' + error.message,
          );
      }
    }
  }

  async declineDebt(id: number, deleteDebtDto: DeleteDebtDto) {
    try {
      const [debt, debtDeletion] = await this.prisma.$transaction([
        this.prisma.debts.update({
          where: {
            id,
          },
          data: { status: debt_status.DECLINED },
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
        message: 'Debt canceled successfully',
        data: {
          debt,
          debtDeletion,
        },
      };
    } catch (error) {
      switch (error.code) {
        case 'P2025':
          throw new PrismaClientKnownRequestError('Debt not found', {
            code: 'P2025',
            clientVersion: '2.20.0',
          });
        case 'P2002':
          throw new PrismaClientKnownRequestError('Debt already deleted', {
            code: 'P2002',
            clientVersion: '2.20.0',
          });
        case undefined:
          throw new PrismaClientKnownRequestError(
            'Deleter must be the creditor or debtor',
            {
              code: 'P0001',
              clientVersion: '2.20.0',
            },
          );
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
      console.log(error.message);
      throw new InternalServerErrorException('Lỗi hệ thống');
    }
  }
}
