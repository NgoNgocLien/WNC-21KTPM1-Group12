import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private readonly databaseService: DatabaseService){}

  async create(createTaskDto: Prisma.tasksCreateInput) {
    return this.databaseService.tasks.create({
      data: createTaskDto
    });
  }

  async findAll() {
    return this.databaseService.tasks.findMany();
  }

  async findOne(id: number) {
    return this.databaseService.$queryRaw`SELECT * FROM tasks WHERE id = ${id}`;
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

  async findByUserId(userId: number) {
    return this.databaseService.tasks.findMany({
      where: {
        user_id: userId, 
      },
    });
  }
}
