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
import { DivisiService } from './divisi.service';
import { AccessTokenGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { Divisi, Users } from '@prisma/client';

@Controller('divisi')
export class DivisiController {
  constructor(private readonly divisiService: DivisiService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  create(@GetUser() user: Users, @Body() createDivisiDto: Divisi) {
    return this.divisiService.create(user, createDivisiDto);
  }

  @Get()
  findAll() {
    return this.divisiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.divisiService.findOne(+id);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  update(
    @GetUser() user: Users,
    @Param('id') id: string,
    @Body() updateDivisiDto: Divisi,
  ) {
    return this.divisiService.update(user, +id, updateDivisiDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@GetUser() user: Users, @Param('id') id: string) {
    return this.divisiService.remove(user, +id);
  }
}
