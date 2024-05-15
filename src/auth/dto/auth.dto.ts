export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  refreshToken: string;
}

export class AuthDto {
  email: string;
  password: string;
}
