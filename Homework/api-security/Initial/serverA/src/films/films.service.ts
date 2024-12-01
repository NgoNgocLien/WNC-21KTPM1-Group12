import { Injectable } from '@nestjs/common';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class FilmsService {

  // private async generateToken(url: string) {
  //   const time = new Date().toISOString();
  //   const token = await bcrypt.hash(`${url}${time}${process.env.SECRET_KEY}`, 10);
  //   return { time, token };
  // }

  async create(createFilmDto: CreateFilmDto) {
    // const { time, token } = await this.generateToken('/api/filmsB');
    const response = await fetch('http://localhost:4000/api/filmsB', {
      method: 'POST',
      body: JSON.stringify(createFilmDto),
      // headers: { 
      //   'Content-Type': 'application/json',
      //   'Authorization': 'Bearer ' + token,
      //   'X-Timestamp': time
      // }
    });
    const data = await response.json();
    return data;
  }

  async findAll() {
    // const { time, token } = await this.generateToken('/api/filmsB');
    const response = await fetch('http://localhost:4000/api/filmsB', {
      method: 'GET',
      // headers: { 
      //   'Content-Type': 'application/json',
      //   'Authorization': 'Bearer ' + token,
      //   'X-Timestamp': time
      // }
    });
    const data = await response.json();
    return data;
  }

  async findOne(id: number) {
    // const { time, token } = await this.generateToken(`/api/filmsB/${id}`);
    const response = await fetch(`http://localhost:4000/api/filmsB/${id}`, {
      method: 'GET',
      // headers: { 
      //   'Content-Type': 'application/json',
      //   'Authorization': 'Bearer ' + token,
      //   'X-Timestamp': time
      // }
    });
    const data = await response.json();
    return data;
  }

  async update(id: number, updateFilmDto: UpdateFilmDto) {
    // const { time, token } = await this.generateToken(`/api/filmsB/${id}`);
    const response = await fetch(`http://localhost:4000/api/filmsB/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateFilmDto),
      // headers: { 
      //   'Content-Type': 'application/json',
      //   'Authorization': 'Bearer ' + token,
      //   'X-Timestamp': time
      // }
    });
    const data = await response.json();
    return data;
  }

  async remove(id: number) {
    // const { time, token } = await this.generateToken(`/api/filmsB/${id}`);
    const response = await fetch(`http://localhost:4000/api/filmsB/${id}`, {
      method: 'DELETE',
      // headers: { 
      //   'Content-Type': 'application/json',
      //   'Authorization': 'Bearer ' + token,
      //   'X-Timestamp': time
      // }
    });
    const data = await response.json();
    return data;
  }
}
