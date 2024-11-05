import { Injectable } from '@nestjs/common';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class FilmsService {
  constructor(private readonly databaseService: DatabaseService){}

  async create(createFilmDto: CreateFilmDto) {
    return this.databaseService.film.create({
      data: createFilmDto
    });
  }

  async findAll() {
    // return this.databaseService.film.findMany();
    return this.databaseService.$queryRaw`SELECT * FROM film_list`;
  }

  async findOne(id: number) {
    return this.databaseService.film.findUnique({
      where: {
        film_id: id
      }
    });
  }

  async update(id: number, updateFilmDto: UpdateFilmDto) {
    return this.databaseService.film.update({
      where: {
        film_id: id
      },
      data: updateFilmDto
    });
  }

  async remove(id: number) {
    return this.databaseService.film.delete({
      where: {
        film_id: id
      }
    });
  }
}
