import { Module } from '@nestjs/common';
import { GenerasiService } from './generasi.service';
import { GenerasiController } from './generasi.controller';

@Module({
  controllers: [GenerasiController],
  providers: [GenerasiService],
})
export class GenerasiModule {}
