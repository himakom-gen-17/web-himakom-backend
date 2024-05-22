import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { GenerasiService } from './generasi.service';
import { CreateGenerasiDto, UpdateGenerasiDto } from './dto';
import { GetUser } from 'src/auth/decorator';
import { Users } from '@prisma/client';
import { AccessTokenGuard } from 'src/auth/guard';

@Controller('generasi')
export class GenerasiController {
  constructor(private readonly generasiService: GenerasiService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Body() createGenerasiDto: CreateGenerasiDto, @GetUser() user: Users) {
    return this.generasiService.create(createGenerasiDto, user);
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
