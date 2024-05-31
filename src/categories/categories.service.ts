import { Injectable } from '@nestjs/common';
import { prismaExclude } from 'src/prisma/exclude';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.category.findMany({
      include: {
        articles: {
          include: {
            user: {
              select: prismaExclude('Users', ['password', 'refreshToken']),
            },
          },
        },
      },
    });
  }

  findOne(id: number | string) {
    return `This action returns a #${id} category`;
  }
}
