import { Injectable } from '@nestjs/common';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import * as crypto from 'crypto';

@Injectable()
export class FilmsService {
  private generateSignature(
    method: string,
    url: string,
  ): { time: string; hash: string } {
    const time = new Date().toISOString();
    const signature = `${method}${url}${time}${process.env.SECRET_KEY}`;
    const hash = crypto.createHash('sha256').update(signature).digest('hex');
    console.log(time, signature);
    return { time, hash };
  }

  private async fetchData(method: string, url: string, body?: object) {
    const { time, hash } = this.generateSignature(method, url);

    const headers = {
      'Content-Type': 'application/json',
      'x-timestamp': time,
      'x-signature': hash,
    };

    const response = await fetch(`http://localhost:4000${url}`, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers,
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return response.json();
  }

  async create(createFilmDto: CreateFilmDto) {
    return this.fetchData('POST', '/api/filmsB', createFilmDto);
  }

  async findAll() {
    return this.fetchData('GET', '/api/filmsB');
  }

  async findOne(id: number) {
    return this.fetchData('GET', `/api/filmsB/${id}`);
  }

  async update(id: number, updateFilmDto: UpdateFilmDto) {
    return this.fetchData('PATCH', `/api/filmsB/${id}`, updateFilmDto);
  }

  async remove(id: number) {
    return this.fetchData('DELETE', `/api/filmsB/${id}`);
  }
}
