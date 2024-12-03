import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private readonly databaseService: DatabaseService){}

  async create(createTaskDto: Prisma.tasksCreateInput, userId: number) {
    return this.databaseService.tasks.create({
      data: {
        ...createTaskDto,
        users: {
          connect: { id: userId }, // Kết nối với user thông qua user_id
        },
      },
    });
  }

  async findAllByUser(userId: number) {
    return this.databaseService.tasks.findMany({
      where: { user_id: userId },
    });
  }

  async findOne(id: number) {
    return this.databaseService.tasks.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateTaskDto: Prisma.tasksUpdateInput) {
    return this.databaseService.tasks.update({
      where: {
        id: id
      },
      data: updateTaskDto
    });
  }

  async remove(id: number) {
    return this.databaseService.tasks.delete({
      where:{
        id: id
      }
    });
  }

  async toggleTaskStatus(id: number) {
    const task = await this.databaseService.tasks.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.databaseService.tasks.update({
      where: { id },
      data: { completed: !task.completed },
    });
  }

  async findByTitle(title: string, userId: number) {
    return this.databaseService.tasks.findMany({
      where: {
        user_id: userId,
        title: {
          contains: title, 
          mode: 'insensitive', // Tìm không phân biệt hoa thường
        },
      },
    });
  }
}
