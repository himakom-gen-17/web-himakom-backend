import { Role } from '@prisma/client';

export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: Role;
  refreshToken: string;
}

export class AuthDto {
  email: string;
  password: string;
}
