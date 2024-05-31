import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { AccessTokenGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { Users } from '@prisma/client';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import {
  ConvertMultipleToWebpPipe,
  ConvertToWebpPipe,
} from 'src/articles/pipes';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profile_picture', maxCount: 1 },
      { name: 'formal_picture', maxCount: 1 },
    ]),
  )
  create(
    @GetUser() user: Users,
    @Body() createUserDto: CreateUserDto,
    @UploadedFiles(ConvertMultipleToWebpPipe)
    files: {
      profile_picture?: Express.Multer.File[];
      formal_picture?: Express.Multer.File[];
    },
  ) {
    return this.usersService.create(user, createUserDto, files);
  }
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  update(
    @GetUser() user: Users,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(user, id, updateUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('profile_picture'))
  @Post(':id/pp')
  updateProfilePicture(
    @GetUser() user: Users,
    @Param('id') id: string,
    @UploadedFile(ConvertToWebpPipe) file: Express.Multer.File,
  ) {
    return this.usersService.editProfilePicture(user, id, file);
  }
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('formal_picture'))
  @Post(':id/fp')
  updateFormalPicture(
    @GetUser() user: Users,
    @Param('id') id: string,
    @UploadedFile(ConvertToWebpPipe) file: Express.Multer.File,
  ) {
    return this.usersService.editFormalPicture(user, id, file);
  }
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@GetUser() user: Users, @Param('id') id: string) {
    return this.usersService.remove(user, id);
  }
}
