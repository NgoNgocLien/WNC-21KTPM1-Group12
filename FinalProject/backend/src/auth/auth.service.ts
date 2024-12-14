import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { CustomersService } from 'src/customers/customers.service';
import { EmployeesService } from 'src/employees/employees.service';
import { JwtPayload } from './types/JwtPayload';
import { Role } from './types/Role';

@Injectable()
export class AuthService {
  constructor(
    private customersService: CustomersService,
    private employeesService: EmployeesService,
    private jwtService: JwtService,
  ) {}

  async login(
    username: string,
    password: string,
    role: Role,
  ): Promise<{ access_token: string; refresh_token: string }> {
    let user = null;

    switch (role) {
      case Role.CUSTOMER:
        user = await this.customersService.findByUsername(username);
        break;
      case Role.EMPLOYEE:
        user = await this.employeesService.findByUsername(username);
        break;
      default:
        throw new UnauthorizedException('Invalid role');
    }

    if (!user) {
      console.log('1');
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await this.compareHashedData(
      password,
      user.password,
    );
    if (!passwordMatches) {
      console.log('2');
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, username: user.username };

    const access_token = await this.getAccessToken(payload);
    const refresh_token = await this.getRefreshToken(payload);

    await this.updateRefreshToken(user.id, refresh_token);

    return { access_token, refresh_token };
  }

  async logout(id: number, role: Role) {
    switch (role) {
      case Role.CUSTOMER:
        return this.customersService.update(id, { refresh_token: null });
      case Role.EMPLOYEE:
        return this.employeesService.update(id, { refresh_token: null });
      default:
        throw new UnauthorizedException('Invalid role');
    }
  }

  async refresh(id: number, refresh_token: string, role: Role) {
    let user = null;
    switch (role) {
      case Role.CUSTOMER:
        user = await this.customersService.findOne(id);
        break;
      case Role.EMPLOYEE:
        user = await this.employeesService.findOne(id);
        break;
      default:
        throw new UnauthorizedException('Invalid role');
    }

    if (!user || !user.refresh_token) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const refreshTokenMatches = await this.compareHashedData(
      refresh_token,
      user.refresh_token,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, username: user.username };

    const access_token = await this.getAccessToken(payload);

    return { access_token, refresh_token };
  }

  async hashData(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }

  async compareHashedData(data: string, hashedData: string): Promise<boolean> {
    return bcrypt.compare(data, hashedData);
  }

  async getAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: '600s',
    });
  }

  async getRefreshToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: '1d',
    });
  }

  async updateRefreshToken(id: number, refresh_token: string) {
    const hashedRefreshToken = await this.hashData(refresh_token);
    return this.customersService.update(id, {
      refresh_token: hashedRefreshToken,
    });
  }
}
