import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Users } from '@prisma/client';
import * as argon from 'argon2';
import { CreateUserDto, UpdateUserDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { prismaExclude } from 'src/prisma/exclude';
import { unlink } from 'fs/promises';
import * as path from 'path';
import { writeFile } from 'fs/promises';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async create(
    user: Users,
    createUserDto: CreateUserDto,
    files: {
      profile_picture?: Express.Multer.File[];
      formal_picture?: Express.Multer.File[];
    },
  ) {
    const profilePicture = files.profile_picture[0];
    const formalPicture = files.formal_picture[0];
    let ppUpload, fpUpload; // Declare variables outside the if block
    try {
      const hash = await argon.hash(
        createUserDto.password ?? (await this.config.get('PASSWORD_DEFAULT')),
      );
      if (user.role !== 'Admin')
        throw new ForbiddenException('Anda bukan admin!');
      if (profilePicture) {
        ppUpload = await this.handleFileUpload(profilePicture);
      }
      if (formalPicture) {
        fpUpload = await this.handleFileUpload(formalPicture);
      }
      await this.prisma.users.create({
        data: {
          ...createUserDto,
          generasiName: +createUserDto.generasiName,
          password: hash,
          profilePicture: ppUpload?.path,
          formalPicture: fpUpload?.path,
        },
      });
      return `User Created Successfully, Profile Picture: ${ppUpload?.path}, Formal Picture: ${fpUpload?.path}`;
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
          generasiName: +updateUserDto.generasiName,
        },
      });
      delete updatedUser.password;
      delete updatedUser.refreshToken;
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async editProfilePicture(user: Users, id: string, file: Express.Multer.File) {
    const validateUser = await this.findOne(id);
    if (!validateUser) throw new NotFoundException('User tidak ditemukan');
    if (validateUser.id !== user.id || user.role !== 'Admin')
      throw new ForbiddenException();

    if (user.profilePicture) {
      try {
        await this.deleteImage(user.profilePicture);
      } catch (error) {
        console.error('Error deleting existing thumbnail:', error);
      }
    }

    const imageUpload = await this.handleFileUpload(file);
    return await this.prisma.users.update({
      where: { id: user.id },
      data: {
        profilePicture: imageUpload.path,
      },
    });
  }
  async editFormalPicture(user: Users, id: string, file: Express.Multer.File) {
    const validateUser = await this.findOne(id);
    if (!validateUser) throw new NotFoundException('User tidak ditemukan');
    if (validateUser.id !== user.id || user.role !== 'Admin')
      throw new ForbiddenException();

    if (user.formalPicture) {
      try {
        await this.deleteImage(user.formalPicture);
      } catch (error) {
        console.error('Error deleting existing thumbnail:', error);
      }
    }

    const imageUpload = await this.handleFileUpload(file);
    return await this.prisma.users.update({
      where: { id: user.id },
      data: {
        formalPicture: imageUpload.path,
      },
    });
  }

  async handleFileUpload(file: Express.Multer.File) {
    const targetPath = path.join('images/users', file.originalname);

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
      if (validateUser.profilePicture) {
        await this.deleteImage(validateUser.profilePicture);
      }
      if (validateUser.formalPicture) {
        await this.deleteImage(validateUser.formalPicture);
      }
      return 'User berhasil dihapus';
    } catch (error) {
      throw error;
    }
  }
}
