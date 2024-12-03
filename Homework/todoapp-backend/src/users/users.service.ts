import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService){}

  async create(createUserDto: Prisma.usersCreateInput) {
    return this.databaseService.users.create({
      data: createUserDto
    });
  }

  async findAll() {
    return this.databaseService.users.findMany();
  }

  async findOne(id: number) {
    return this.databaseService.$queryRaw`SELECT * FROM users WHERE id = ${id}`;
  }

  async update(id: number, updateUserDto: Prisma.usersUpdateInput) {
    return this.databaseService.users.update({
      where: {
        id: id
      },
      data: updateUserDto
    });
  }

  async remove(id: number) {
    return this.databaseService.users.delete({
      where:{
        id: id
      }
    });
  }
}
