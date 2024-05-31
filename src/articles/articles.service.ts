import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArticleDto, UpdateArticleDto } from './dto';
import { Users } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { prismaExclude } from 'src/prisma/exclude';
import { unlink, writeFile } from 'fs/promises';
import * as path from 'path';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async create(
    user: Users,
    createArticleDto: CreateArticleDto,
    file: Express.Multer.File,
  ) {
    const imageUpload = await this.handleFileUpload(file);
    const slug = this.slugify(createArticleDto.title);
    try {
      if (!user) throw new ForbiddenException();
      const article = await this.prisma.articles.create({
        data: {
          ...createArticleDto,
          slug: createArticleDto.slug ?? slug,
          thumbnail: imageUpload.path,
          userId: user.id,
          divisiId: +createArticleDto.divisiId,
          categories: {
            connectOrCreate: createArticleDto.categories.map((cat) => ({
              where: {
                id: cat.id ? cat.id : undefined,
                name: !cat.id ? cat.name : undefined,
              },
              create: { name: cat.name },
            })),
          },
        },
      });
      return {
        message: 'Artikel berhasil dibuat',
        article: article,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.articles.findMany({
      include: {
        user: {
          select: prismaExclude('Users', ['password', 'refreshToken']),
        },
        categories: true,
        divisi: true,
      },
    });
  }

  async findOne(idOrSlug: number | string) {
    return await this.prisma.articles.findFirst({
      where: {
        OR: [
          { id: typeof idOrSlug === 'number' ? idOrSlug : undefined },
          { slug: typeof idOrSlug === 'string' ? idOrSlug : undefined },
        ],
      },
      include: {
        user: {
          select: prismaExclude('Users', ['password', 'refreshToken']),
        },
        categories: true,
        divisi: true,
      },
    });
  }

  async update(user: Users, id: number, updateArticleDto: UpdateArticleDto) {
    const article = await this.findOne(id);
    if (!article) throw new NotFoundException('Artikel tidak ditemukan');
    if (article.userId !== user.id || user.role !== 'Admin')
      throw new ForbiddenException();
    try {
      console.log({
        divisiId: updateArticleDto.divisiId,
        kategori: updateArticleDto.categories,
      });
      return await this.prisma.articles.update({
        where: { id: article.id },
        data: {
          ...updateArticleDto,
          divisiId: +updateArticleDto.divisiId,
          categories: {
            connectOrCreate: updateArticleDto.categories.map((cat) => ({
              where: {
                id: cat.id ? cat.id : undefined,
                name: !cat.id ? cat.name : undefined,
              },
              create: { name: cat.name },
            })),
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async editThumbnail(user: Users, id: number, file: Express.Multer.File) {
    const article = await this.findOne(id);
    if (!article) throw new NotFoundException('Artikel tidak ditemukan');
    if (article.userId !== user.id || user.role !== 'Admin')
      throw new ForbiddenException();

    if (article.thumbnail) {
      try {
        await this.deleteImage(article.thumbnail);
      } catch (error) {
        console.error('Error deleting existing thumbnail:', error);
      }
    }

    const imageUpload = await this.handleFileUpload(file);
    return await this.prisma.articles.update({
      where: { id: article.id },
      data: {
        thumbnail: imageUpload.path,
      },
    });
  }

  async deleteImage(path: string) {
    try {
      await unlink(path);
      return { message: 'Image deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  async remove(user: Users, idOrSlug: number | string) {
    const article = await this.findOne(idOrSlug);
    if (!article) throw new NotFoundException('Artikel tidak ditemukan');
    if (article.userId !== user.id || user.role !== 'Admin')
      throw new ForbiddenException();
    try {
      await this.deleteImage(article.thumbnail);
      return await this.prisma.articles.delete({
        where: {
          id: typeof idOrSlug === 'number' ? idOrSlug : undefined,
          slug: typeof idOrSlug === 'string' ? idOrSlug : undefined,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async handleFileUpload(file: Express.Multer.File) {
    const targetPath = path.join('images/articles', file.originalname);

    await writeFile(targetPath, file.buffer);

    return {
      message: 'File uploaded and converted to WebP successfully',
      path: targetPath,
    };
  }

  slugify(str: string) {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
