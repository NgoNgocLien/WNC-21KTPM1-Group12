import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/createAdmin.dto';
import { UpdateAdminDto } from './dto/updateAdmin.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class AdminsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAdminDto: CreateAdminDto) {
    try {
      const admin = await this.prisma.admins.create({
        data: createAdminDto,
      });

      return {
        message: 'Admin created successfully',
        data: admin,
      };
    } catch (error) {
      throw new Error('Error creating admin: ' + error.message);
    }
  }

  async findAll() {
    try {
      const admins = await this.prisma.admins.findMany();

      return {
        message: 'Admins fetched successfully',
        data: admins,
      };
    } catch (error) {
      throw new Error('Error fetching admins: ' + error.message);
    }
  }

  async findById(id: number) {
    try {
      const admin = await this.prisma.admins.findUnique({
        where: {
          id,
        }, select: {
          id: true,
          username: true,
        },
      });

      return {
        message: 'Admin found successfully',
        data: admin,
      };
    } catch (error) {
      throw new Error('Error finding admin: ' + error.message);
    }
  }

  async findByUsername(username: string) {
    try {
      const admin = await this.prisma.admins.findUnique({
        where: {
          username,
        },
      });

      return {
        message: 'Admin found successfully',
        data: admin,
      };
    } catch (error) {
      throw new Error('Error finding admin: ' + error.message);
    }
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    try {
      const admin = await this.prisma.admins.update({
        where: {
          id,
        },
        data: updateAdminDto,
      });

      return {
        message: 'Admin updated successfully',
        data: admin,
      };
    } catch (error) {
      throw new Error('Error updating admin: ' + error.message);
    }
  }

  async remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
