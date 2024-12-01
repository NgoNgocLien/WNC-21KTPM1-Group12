import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: '$2b$10$fsW9WYvtyKVNHmXv3YzuVuMI2h1fdGmt5P1hsHa74RzOnwNozQcGC',
      refreshToken: '',
    },
    {
      userId: 2,
      username: 'maria',
      password: '$2b$10$aZIQYH5lJ9hOMq2js9aAHuBBIRpzJgNgIkeoZs7xv6zVsrFqKjXhu',
      refreshToken: '',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  async findById(userId: number): Promise<User | undefined> {
    return this.users.find((user) => user.userId === userId);
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
