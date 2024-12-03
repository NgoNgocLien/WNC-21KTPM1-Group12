import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Prisma } from '@prisma/client';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { UseGuards, Request } from '@nestjs/common';

@Controller('tasks')
@UseGuards(AccessTokenGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: Prisma.tasksCreateInput, @Request() req) {
    const userId = req.user.sub;
    return this.tasksService.create(createTaskDto, userId);
  }

  @Get()
  findAll(@Request() req) {
    const userId = req.user.sub;
    return this.tasksService.findAllByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: Prisma.tasksUpdateInput) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }

  @Patch(':id/toggle-status')
  toggleTaskStatus(@Param('id') id: string) {
    return this.tasksService.toggleTaskStatus(+id);
  }

  @Get('search')
  searchTasks(@Query('title') title: string, @Request() req) {
    const userId = req.user.sub;
    return this.tasksService.findByTitle(title, userId);
  }
}
