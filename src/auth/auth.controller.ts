import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, CreateUserDto } from './dto';
import { AccessTokenGuard } from './guard';
import { GetUser } from './decorator';
import { Users } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }
  @Post('signin')
  signin(@Body() authDto: AuthDto) {
    return this.authService.signin(authDto);
  }
  @UseGuards(AccessTokenGuard)
  @Get('logout')
  signout(@GetUser() user: Users) {
    return this.authService.signout(user.id);
  }
}
