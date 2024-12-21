import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { CustomersService } from 'src/modules/customers/customers.service';
import { EmployeesService } from 'src/modules/employees/employees.service';
import { AdminsService } from 'src/modules/admins/admins.service';
import { JwtPayload } from './types/JwtPayload';
import { Role } from './types/Role';

@Injectable()
export class AuthService {
  constructor(
    private customersService: CustomersService,
    private employeesService: EmployeesService,
    private adminsService: AdminsService,
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
      case Role.ADMIN:
        user = await this.adminsService.findByUsername(username);
        break;
      default:
        throw new UnauthorizedException('Invalid role');
    }

    if (!user || !user.data) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (role === Role.EMPLOYEE && user.data.status === 'DELETED') {
      throw new UnauthorizedException('Account has been deleted');
    }

    const passwordMatches = await this.compareHashedData(
      password,
      user.data.password,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.data.id,
      username: user.data.username,
      role: role,
    };

    const access_token = await this.getAccessToken(payload);
    const refresh_token = await this.getRefreshToken(payload);

    await this.updateRefreshToken(user.data.id, refresh_token, role);

    return { access_token, refresh_token };
  }

  async logout(id: number, role: Role) {
    switch (role) {
      case Role.CUSTOMER:
        return this.customersService.update(id, { refresh_token: null });
      case Role.EMPLOYEE:
        return this.employeesService.update(id, { refresh_token: null });
      case Role.ADMIN:
        return this.adminsService.update(id, { refresh_token: null });
      default:
        throw new UnauthorizedException('Invalid role');
    }
  }

  async refresh(id: number, refresh_token: string, role: Role) {
    let user = null;
    switch (role) {
      case Role.CUSTOMER:
        user = await this.customersService.findById(id);
        break;
      case Role.EMPLOYEE:
        user = await this.employeesService.findById(id);
        break;
      case Role.ADMIN:
        user = await this.adminsService.findById(id);
        break;
      default:
        throw new UnauthorizedException('Invalid role');
    }

    if (!user || !user.data.refresh_token) {
      console.log(user);
      console.log(user.data);
      throw new UnauthorizedException('Invalid credentials');
    }

    const refreshTokenMatches = await this.compareHashedData(
      refresh_token,
      user.data.refresh_token,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.data.id,
      username: user.data.username,
      role: role,
    };

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
      expiresIn: '100d',
    });
  }

  async getRefreshToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: '100d',
    });
  }

  async updateRefreshToken(id: number, refresh_token: string, role: string) {
    const hashedRefreshToken = await this.hashData(refresh_token);
    switch (role) {
      case Role.CUSTOMER:
        return this.customersService.update(id, {
          refresh_token: hashedRefreshToken,
        });
      case Role.EMPLOYEE:
        return this.employeesService.update(id, {
          refresh_token: hashedRefreshToken,
        });
      case Role.ADMIN:
        return this.adminsService.update(id, {
          refresh_token: hashedRefreshToken,
        });
      default:
        throw new UnauthorizedException('Invalid role');
    }
  }

  async verifyRecaptcha(token: string) {
    try {
      if (!process.env.RECAPTCHA_SECRET_KEY) {
        throw new Error('RECAPTCHA_SECRET_KEY is not defined');
      }
      const response = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
        {
          method: 'POST',
        },
      );

      const data = await response.json();

      return data.success;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
