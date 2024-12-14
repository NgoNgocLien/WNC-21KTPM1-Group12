import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/createAdmin.dto';
import { UpdateAdminDto } from './dto/updateAdmin.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAdminDto: CreateAdminDto) {
    return 'This action adds a new admin';
  }

  async findAll() {
    return `This action returns all admins`;
  }

  async findOne(id: number) {
    return this.prisma.admins.findUnique({
      where: {
        id,
      },
    });
  }

  async findByUsername(username: string) {
    return this.prisma.admins.findUnique({
      where: {
        username,
      },
    });
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    const admin = this.prisma.admins.update({
      where: {
        id,
      },
      data: updateAdminDto,
    });
    return admin;
  }

  async remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
