import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ActorsService } from './actors.service';
import { Prisma } from '@prisma/client';

@Controller('actors')
export class ActorsController {
  constructor(private readonly actorsService: ActorsService) {}

  @Post()
  create(@Body() createActorDto: Prisma.actorCreateInput) {
    return this.actorsService.create(createActorDto);
  }

  @Get()
  findAll() {
    return this.actorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.actorsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateActorDto: Prisma.actorUpdateInput) {
    return this.actorsService.update(+id, updateActorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.actorsService.remove(+id);
  }
}
