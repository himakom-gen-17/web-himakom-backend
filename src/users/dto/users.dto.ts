import { PartialType } from '@nestjs/mapped-types';
import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  password: string;

  @IsString()
  name: string;

  generasiName: number;

  @IsEnum(Role)
  role: Role;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
