import { Injectable } from '@nestjs/common';

export type User = {
  userId: number;
  username: string;
  password: string;
};

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: '$2b$10$fsW9WYvtyKVNHmXv3YzuVuMI2h1fdGmt5P1hsHa74RzOnwNozQcGC',
    },
    {
      userId: 2,
      username: 'maria',
      password: '$2b$10$aZIQYH5lJ9hOMq2js9aAHuBBIRpzJgNgIkeoZs7xv6zVsrFqKjXhu',
    },
  ];

  async findById(userId: number) {
    return this.users.find((user) => user.userId === userId);
  }

  async findByUsername(username: string) {
    return this.users.find((user) => user.username === username);
  }

  async create(user: User) {
    this.users.push({
      userId: this.users.length + 1,
      ...user,
    });
    return user;
  }

  async update(userId: number, update: Partial<User>) {
    const user = this.users.find((user) => user.userId === userId);
    if (user) {
      Object.assign(user, update);
      return user;
    }
    return null;
  }
}
