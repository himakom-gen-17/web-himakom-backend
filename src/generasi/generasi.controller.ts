import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { GenerasiService } from './generasi.service';
import { CreateGenerasiDto, UpdateGenerasiDto } from './dto';
import { GetUser } from 'src/auth/decorator';
import { Users } from '@prisma/client';
import { AccessTokenGuard } from 'src/auth/guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConvertToWebpPipe } from 'src/articles/pipes';

@Controller('generasi')
export class GenerasiController {
  constructor(private readonly generasiService: GenerasiService) {}

  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  create(
    @Body() createGenerasiDto: CreateGenerasiDto,
    @GetUser() user: Users,
    @UploadedFile(ConvertToWebpPipe) file: Express.Multer.File,
  ) {
    return this.generasiService.create(createGenerasiDto, user, file);
  }

  @Get()
  findAll() {
    return this.generasiService.findAll();
  }

  @Get(':name')
  findOne(@Param('name') name: number) {
    return this.generasiService.findOne(+name);
  }

  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post(':name/image')
  editGenerasiImage(
    @Param('name') name: number,
    @GetUser() user: Users,
    @UploadedFile(ConvertToWebpPipe) file: Express.Multer.File,
  ) {
    return this.generasiService.editGenerasiPicture(user, +name, file);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':name')
  update(
    @Param('name') name: number,
    @Body() updateGenerasiDto: UpdateGenerasiDto,
    @GetUser() user: Users,
  ) {
    return this.generasiService.update(+name, updateGenerasiDto, user);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':name')
  remove(@Param('name') name: number, @GetUser() user: Users) {
    return this.generasiService.remove(+name, user);
  }
}
