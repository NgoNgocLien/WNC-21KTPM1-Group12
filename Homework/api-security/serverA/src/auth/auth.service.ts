import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private users = [
    { id: 1, username: 'john_doe', password: '1234' }, 
  ];

  constructor(private readonly jwtService: JwtService) {}

  // userService
  async findUser(username: string, password: string){
    return this.users.find(user => user.username === username && user.password === password);
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    // 1. Validate user credentials
    const user = await this.findUser(username, password);
    if (!user) {
      throw new Error('User not found');
    }

    // const passwordValid = await bcrypt.compare(password, user.password);
    // if (!passwordValid) {
    //   throw new Error('Invalid credentials');
    // }

    // 2. Create payload for the AccessToken
    const payload = {
      username: user.username,
      userId: user.id,
      timestamp: new Date().getTime(),
    };

    // 3. Generate the JWT (AccessToken)
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
