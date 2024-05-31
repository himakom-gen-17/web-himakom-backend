import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { GenerasiModule } from './generasi/generasi.module';
import { DivisiModule } from './divisi/divisi.module';
import { ArticlesModule } from './articles/articles.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    PrismaModule,
    AuthModule,
    GenerasiModule,
    DivisiModule,
    ArticlesModule,
  ],
})
export class AppModule {}
