import { Injectable } from '@nestjs/common';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ActorsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createActorDto: CreateActorDto) {
    return this.databaseService.actor.create({
      data: createActorDto
    });
  }

  async findAll() {
    return this.databaseService.actor.findMany();
  }

  async findOne(id: number) {
    return this.databaseService.actor.findUnique({
      where: {
        actor_id: id
      }
    });
  }

  async update(id: number, updateActorDto: UpdateActorDto) {
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
