import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Users } from '@prisma/client';
import * as argon from 'argon2';
import { CreateUserDto, UpdateUserDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { prismaExclude } from 'src/prisma/exclude';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async create(user: Users, createUserDto: CreateUserDto) {
    try {
      const hash = await argon.hash(
        createUserDto.password ?? (await this.config.get('PASSWORD_DEFAULT')),
      );
      if (user.role !== 'Admin')
        throw new ForbiddenException('Anda bukan admin!');
      await this.prisma.users.create({
        data: {
          ...createUserDto,
          password: hash,
        },
      });

      return 'User Created Successfully';
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.users.findMany({
      orderBy: {
        generasiName: {
          sort: 'desc',
        },
      },
      select: {
        generasi: true,
        articles: true,
        id: true,
        email: true,
        role: true,
        name: true,
        generasiName: true,
        kepengurusan: true,
        createdAt: true,
        updatedAt: true,
        formalPicture: true,
        profilePicture: true,
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.users.findUnique({
      where: {
        id: id,
      },
      select: {
        generasi: true,
        articles: true,
        id: true,
        email: true,
        role: true,
        name: true,
        generasiName: true,
        kepengurusan: true,
        createdAt: true,
        updatedAt: true,
        formalPicture: true,
        profilePicture: true,
      },
    });
  }

  async update(user: Users, id: string, updateUserDto: UpdateUserDto) {
    try {
      delete updateUserDto.password;
      const validateUser = await this.prisma.users.findUnique({
        where: {
          id: id,
        },
      });
      if (validateUser.id !== id || user.role !== 'Admin')
        throw new ForbiddenException();
      const updatedUser = await this.prisma.users.update({
        where: {
          id: id,
        },
        data: {
          ...updateUserDto,
        },
      });
      delete updatedUser.password;
      delete updatedUser.refreshToken;
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async remove(user: Users, id: string) {
    try {
      const validateUser = await this.prisma.users.findUnique({
        where: {
          id: id,
        },
      });
      if (validateUser.id !== id || user.role !== 'Admin')
        throw new ForbiddenException();
      await this.prisma.users.delete({
        where: {
          id: id,
        },
      });
      return 'User berhasil dihapus';
    } catch (error) {
      throw error;
    }
  }
}
