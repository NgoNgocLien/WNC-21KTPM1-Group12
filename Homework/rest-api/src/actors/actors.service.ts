import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ActorsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createActorDto: Prisma.actorCreateInput) {
    return this.databaseService.actor.create({
        data: createActorDto
    });
  }

  async findAll() {
    return this.databaseService.actor.findMany();
  }

  async findOne(id: number) {
    return this.databaseService.$queryRaw`SELECT * FROM actor_info WHERE actor_id = ${id}`
  }

  async update(id: number, updateActorDto: Prisma.actorUpdateInput) {
    return this.databaseService.actor.update({
        where: {
            actor_id: id
        },
        data: updateActorDto
    })
  }

  async remove(id: number) {
    return this.databaseService.actor.delete({
        where: {
            actor_id: id
        }
    })
  }
}
