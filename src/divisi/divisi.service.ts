import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Divisi, Users } from '@prisma/client';

@Injectable()
export class DivisiService {
  constructor(private prisma: PrismaService) {}
  async create(user: Users, createDivisiDto: Divisi) {
    if (user.role !== 'Admin')
      throw new ForbiddenException('Anda bukan admin!');
    try {
      const divisi = await this.prisma.divisi.create({
        data: {
          ...createDivisiDto,
        },
      });
      return divisi;
    } catch (err) {
      throw err;
    }
  }

  findAll() {
    return `This action returns all divisi`;
  }

  findOne(id: number) {
    return `This action returns a #${id} divisi`;
  }

  async update(user: Users, id: number, updateDivisiDto: Divisi) {
    if (user.role !== 'Admin')
      throw new ForbiddenException('Anda bukan admin!');
    try {
      const divisi = await this.prisma.divisi.update({
        where: {
          id,
        },
        data: {
          ...updateDivisiDto,
        },
      });
      return divisi;
    } catch (err) {
      throw err;
    }
  }

  async remove(user: Users, id: number) {
    if (user.role !== 'Admin')
      throw new ForbiddenException('Anda bukan admin!');
    try {
      const divisi = await this.prisma.divisi.delete({
        where: {
          id,
        },
      });
      return divisi;
    } catch (err) {
      throw err;
    }
  }
}
