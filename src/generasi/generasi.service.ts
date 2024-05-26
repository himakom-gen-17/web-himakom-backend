import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateGenerasiDto, UpdateGenerasiDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Users } from '@prisma/client';
import { prismaExclude } from 'src/prisma/exclude';

@Injectable()
export class GenerasiService {
  constructor(private prisma: PrismaService) {}

  async create(createGenerasiDto: CreateGenerasiDto, user: Users) {
    try {
      if (user.role !== 'Admin')
        throw new ForbiddenException('Anda bukan admin!');
      const generasi = await this.prisma.generasi.create({
        data: {
          ...createGenerasiDto,
        },
      });
      return generasi;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    const generasiArr = await this.prisma.generasi.findMany({
      include: {
        user: {
          select: prismaExclude('Users', ['password', 'refreshToken']),
        },
      },
    });
    return generasiArr;
  }

  async findOne(name: number) {
    try {
      const generasi = await this.prisma.generasi.findUnique({
        where: {
          name: name,
        },
        include: {
          user: {
            select: prismaExclude('Users', ['password', 'refreshToken']),
          },
        },
      });
      return generasi;
    } catch (error) {
      throw error;
    }
  }

  async update(
    name: number,
    updateGenerasiDto: UpdateGenerasiDto,
    user: Users,
  ) {
    try {
      if (user.role !== 'Admin')
        throw new ForbiddenException('Anda bukan admin');
      const generasi = await this.prisma.generasi.update({
        where: {
          name: name,
        },
        data: {
          ...updateGenerasiDto,
        },
      });
      return generasi;
    } catch (error) {
      throw error;
    }
  }

  async remove(name: number, user: Users) {
    try {
      if (user.role !== 'Admin')
        throw new ForbiddenException('Anda bukan admin');
      const generasi = await this.prisma.generasi.delete({
        where: {
          name: name,
        },
      });
      return generasi;
    } catch (error) {
      throw error;
    }
  }
}
