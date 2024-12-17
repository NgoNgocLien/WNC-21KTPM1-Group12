import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { DatabaseService } from 'src/common/database/database.service';

@Injectable()
export class UsersService {
  // constructor(private readonly databaseService: DatabaseService) {}

  private users = [
    {
      id: 1,
      username: 'johndoe',
      password: '$2b$10$fsW9WYvtyKVNHmXv3YzuVuMI2h1fdGmt5P1hsHa74RzOnwNozQcGC',
      refreshToken: null,
    },
    {
      id: 2,
      username: 'janesmith',
      password: '$2b$10$fsW9WYvtyKVNHmXv3YzuVuMI2h1fdGmt5P1hsHa74RzOnwNozQcGC',
      refreshToken: null,
    },
  ];

  async create(createUserDto: CreateUserDto) {
    const user = {
      id: this.users[this.users.length - 1].id + 1,
      ...createUserDto,
      refreshToken: null,
    };
    this.users.push(user);
    return user;
  }

  async findAll() {
    return this.users;
  }

  async findById(id: number) {
    return this.users.find((user) => user.id === id);
  }

  async findByUsername(username: string) {
    return this.users.find((user) => user.username === username);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = this.users.find((user) => user.id === id);
    if (user) {
      Object.assign(user, updateUserDto);
    }
    return user;
  }

  async remove(id: number) {
    const userIndex = this.users.findIndex((user) => user.id === id);
    return this.users.splice(userIndex, 1);
  }

  // async create(createUserDto: CreateUserDto) {
  //   return this.databaseService.user.create({
  //     data: createUserDto,
  //   });
  // }

  // async findAll() {
  //   return this.databaseService.user.findMany();
  // }

  // async findById(id: number) {
  //   return this.databaseService.user.findUnique({
  //     where: { id },
  //   });
  // }

  // async findByUsername(username: string) {
  //   return this.databaseService.user.findUnique({
  //     where: { username },
  //   });
  // }

  // async update(id: number, updateUserDto: UpdateUserDto) {
  //   return this.databaseService.user.update({
  //     where: { id },
  //     data: updateUserDto,
  //   });
  // }

  // async remove(id: number) {
  //   return this.databaseService.user.delete({
  //     where: { id },
  //   });
  // }
}
