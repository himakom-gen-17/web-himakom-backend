import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
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

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await argon.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
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
          id: userId,
          email,
        },
        {
          secret: this.config.get('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwt.signAsync(
        {
          id: userId,
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
