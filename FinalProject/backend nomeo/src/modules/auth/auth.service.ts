import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as openpgp from 'openpgp';

import { CustomersService } from 'src/modules/customers/customers.service';
import { EmployeesService } from 'src/modules/employees/employees.service';
import { AdminsService } from 'src/modules/admins/admins.service';
import { JwtPayload } from './types/JwtPayload';
import { Role } from './types/Role';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private customersService: CustomersService,
    private employeesService: EmployeesService,
    private adminsService: AdminsService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async login(
    username: string,
    password: string,
    role: Role,
    fcm_token: string,
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
      fcm_token: fcm_token,
    };

    const access_token = await this.getAccessToken(payload);
    const refresh_token = await this.getRefreshToken(payload);

    await this.updateRefreshToken(user.data.id, refresh_token, role);
    if (role === Role.CUSTOMER) {
      await this.updateFcmToken(user.data.id, fcm_token);
    }

    return { access_token, refresh_token };
  }

  async logout(id: number, role: Role) {
    switch (role) {
      case Role.CUSTOMER:
        return await this.customersService.update(id, {
          refresh_token: null,
          fcm_token: null,
        });
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

  async updateFcmToken(id: number, fcm_token: string) {
    this.customersService.update(id, { fcm_token: fcm_token });
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

  hashPayload(data: string, secret_key: string) {
    return crypto
      .createHash('sha256')
      .update(data + secret_key)
      .digest('hex');
  }

  verifyHash(data: string, secret_key: string, hashData: string) {
    const expected = crypto
      .createHash('sha256')
      .update(data + secret_key)
      .digest('hex');

    // console.log(expected, '`n', hashData)
    return expected === hashData;
  }

  async encryptData(
    data: string,
    public_key: string,
    encryptMethod: string = 'RSA',
  ) {
    if (encryptMethod == 'PGP') {
      const publicKeyObj = await openpgp.readKey({ armoredKey: public_key });

      const encryptedPayload = await openpgp.encrypt({
        message: await openpgp.createMessage({ text: data }),
        encryptionKeys: publicKeyObj,
      });

      return encryptedPayload;
    }

    const dataBuffer = Buffer.from(data);
    const encryptedPayload = crypto
      .publicEncrypt(public_key, dataBuffer)
      .toString('base64');
    return encryptedPayload;
  }

  async decryptData(
    data: string,
    private_key: string,
    encryptMethod: string = 'RSA',
  ) {
    if (encryptMethod == 'PGP') {
      const privateKeyObj = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({ armoredKey: private_key }),
        passphrase: process.env.PASSPHRASES,
      });

      const decrypted = await openpgp.decrypt({
        message: await openpgp.readMessage({ armoredMessage: data }),
        decryptionKeys: privateKeyObj,
      });

      return JSON.parse(decrypted.data);
    }

    const encryptedBuffer = Buffer.from(data, 'base64');
    const decryptedBuffer = crypto.privateDecrypt(private_key, encryptedBuffer);
    return JSON.parse(decryptedBuffer.toString());
  }

  async createSignature(
    data: string,
    private_key: string,
    encryptMethod: string = 'RSA',
  ) {
    if (encryptMethod == 'PGP') {
      const privateKeyObj = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({ armoredKey: private_key }),
        passphrase: process.env.PASSPHRASES,
      });

      // Sign the data
      const signedMessage = await openpgp.sign({
        message: await openpgp.createMessage({ text: data }), // Message to be signed
        signingKeys: privateKeyObj, // Private key for signing
      });

      return signedMessage;
    }

    const sign = crypto.createSign('SHA256');
    sign.update(data);
    sign.end();

    return sign.sign(private_key, 'base64');
  }

  async verifySignature(
    data: string,
    public_key: string,
    signature: string,
    encryptMethod: string = 'RSA',
  ) {
    if (encryptMethod == 'PGP') {
      const publicKeyObj = await openpgp.readKey({ armoredKey: public_key });

      const signatureObj = await openpgp.readSignature({
        armoredSignature: signature,
      });

      const messageObj = await openpgp.createMessage({ text: data });

      const verificationResult = await openpgp.verify({
        message: messageObj, // Original data
        signature: signatureObj, // Signature object
        verificationKeys: publicKeyObj, // Public key
      });

      const { verified } = verificationResult.signatures[0];
      await verified;
      return true;
    }

    const verify = crypto.createVerify('SHA256');
    verify.update(data);
    verify.end();

    return verify.verify(public_key, signature, 'base64');
  }

  verifyTimestamp(timestamp: string) {
    const currentTime = Date.now();
    const requestTime = Number(timestamp);
    return (
      !isNaN(requestTime) && 
      requestTime > 0 && // Ensure timestamp is positive
      currentTime - requestTime <= 10000 && 
      currentTime >= requestTime // Ensure the timestamp is not in the future
    );
  }
}
