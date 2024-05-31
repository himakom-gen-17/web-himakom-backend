import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGenerasiDto, UpdateGenerasiDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Users } from '@prisma/client';
import { prismaExclude } from 'src/prisma/exclude';
import { unlink } from 'fs/promises';
import { writeFile } from 'fs/promises';
import * as path from 'path';

@Injectable()
export class GenerasiService {
  constructor(private prisma: PrismaService) {}

  async create(
    createGenerasiDto: CreateGenerasiDto,
    user: Users,
    file: Express.Multer.File,
  ) {
    try {
      if (user.role !== 'Admin')
        throw new ForbiddenException('Anda bukan admin!');
      const imageUpload = await this.handleFileUpload(file);
      const generasi = await this.prisma.generasi.create({
        data: {
          ...createGenerasiDto,
          name: +createGenerasiDto.name,
          image: imageUpload.path,
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
          name: +updateGenerasiDto.name,
        },
      });
      return generasi;
    } catch (error) {
      throw error;
    }
  }
  async editGenerasiPicture(
    user: Users,
    name: number,
    file: Express.Multer.File,
  ) {
    const generasi = await this.findOne(name);
    if (!generasi) throw new NotFoundException('Generasi tidak ditemukan');
    if (user.role !== 'Admin') throw new ForbiddenException();

    if (generasi.image) {
      try {
        await this.deleteImage(generasi.image);
      } catch (error) {
        console.error('Error deleting existing image:', error);
      }
    }

    const imageUpload = await this.handleFileUpload(file);
    return await this.prisma.generasi.update({
      where: { name: name },
      data: {
        image: imageUpload.path,
      },
    });
  }

  async handleFileUpload(file: Express.Multer.File) {
    const targetPath = path.join('images/generasi', file.originalname);

    await writeFile(targetPath, file.buffer);

    return {
      message: 'File uploaded and converted to WebP successfully',
      path: targetPath,
    };
  }

  async deleteImage(path: string) {
    try {
      await unlink(path);
      return { message: 'Image deleted successfully' };
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
      if (generasi.image) {
        try {
          await this.deleteImage(generasi.image);
        } catch (error) {
          console.error('Error deleting existing image:', error);
        }
      }
      return generasi;
    } catch (error) {
      throw error;
    }
  }
}
