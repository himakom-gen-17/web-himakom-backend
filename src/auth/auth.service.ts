import { ConfigService } from '@nestjs/config';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';

import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, CreateUserDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const hash = await this.hashData(createUserDto.password);
    try {
      const userExist = await this.prisma.users.findUnique({
        where: {
          email: createUserDto.email,
        },
      });

      if (userExist) {
        throw new BadRequestException('Email telah digunakan');
      }

      const user = await this.prisma.users.create({
        data: {
          ...createUserDto,
          password: hash,
        },
      });
      delete user.password;
      return user;
    } catch (error) {
      throw error;
    }
  }

  async signin(authDto: AuthDto) {
    try {
      const user = await this.prisma.users.findUnique({
        where: {
          email: authDto.email,
        },
      });
      if (!user) throw new BadRequestException('User Tidak Ditemukan');
      const validatePw = await argon.verify(user.password, authDto.password);
      if (!validatePw) throw new BadRequestException('Password Salah');
      const token = this.getTokens(user.id, user.email);
      await this.updateRefreshToken(user.id, (await token).refreshToken);
      return token;
    } catch (error) {
      throw error;
    }
  }

  async signout(userId: string) {
    try {
      await this.prisma.users.update({
        where: {
          id: userId,
        },
        data: {
          refreshToken: null,
        },
      });
      return 'Logout Success';
    } catch (error) {
      throw error;
    }
  }

  hashData(data: string) {
    return argon.hash(data);
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: hashedRefreshToken,
      },
    });
  }

  async getTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.config.get('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwt.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.config.get('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
