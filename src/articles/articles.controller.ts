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
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto, UpdateArticleDto } from './dto';
import { AccessTokenGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { Users } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConvertToWebpPipe } from './pipes';
import { ParseCategoriesPipe } from './pipes';

@Controller('article')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  @UseInterceptors(FileInterceptor('thumbnail'))
  create(
    @GetUser() user: Users,
    @Body(ParseCategoriesPipe) createArticleDto: CreateArticleDto,
    @UploadedFile(ConvertToWebpPipe) file: Express.Multer.File,
  ) {
    return this.articlesService.create(user, createArticleDto, file);
  }

  @Get()
  findAll() {
    return this.articlesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(+id);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  update(
    @GetUser() user: Users,
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articlesService.update(user, +id, updateArticleDto);
  }

  @UseGuards(AccessTokenGuard)
  @Post(':id/image')
  @UseInterceptors(FileInterceptor('thumbnail'))
  editThumbnail(
    @GetUser() user: Users,
    @Param('id') id: string,
    @UploadedFile(ConvertToWebpPipe) file: Express.Multer.File,
  ) {
    return this.articlesService.editThumbnail(user, +id, file);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@GetUser() user: Users, @Param('id') id: string) {
    return this.articlesService.remove(user, +id);
  }
}
