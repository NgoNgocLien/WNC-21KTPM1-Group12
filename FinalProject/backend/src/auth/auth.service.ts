import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomersService } from 'src/customers/customers.service';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './types/JwtPayload';

@Injectable()
export class AuthService {
  constructor(
    private customersService: CustomersService,
    private jwtService: JwtService,
  ) {}

  async login(
    username: string,
    pass: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const customer = await this.customersService.findByUsername(username);

    if (!customer) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await this.compareHashedData(
      pass,
      customer.password,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: customer.id, username: customer.username };

    const accessToken = await this.getAccessToken(payload);
    const refreshToken = await this.getRefreshToken(payload);

    await this.updateRefreshToken(customer.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async logout(id: number) {
    return this.customersService.update(id, { refresh_token: null });
  }

  async refresh(id: number, refreshToken: string) {
    const customer = await this.customersService.findOne(id);

    if (!customer || !customer.refresh_token) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const refreshTokenMatches = await this.compareHashedData(
      refreshToken,
      customer.refresh_token,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: customer.id, username: customer.username };

    const accessToken = await this.getAccessToken(payload);

    return { accessToken, refreshToken };
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
