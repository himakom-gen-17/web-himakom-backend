import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, CreateUserDto } from './dto';
import { AccessTokenGuard, RefreshTokenGuard } from './guard';
import { GetUser } from './decorator';
import { Users } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  signin(@Body() authDto: AuthDto) {
    return this.authService.signin(authDto);
  }

  @Get('me')
  @UseGuards(AccessTokenGuard)
  me(@GetUser() user: Users) {
    return user;
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  signout(@GetUser() user: Users) {
    return this.authService.signout(user.id);
  }
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(
    @GetUser() req: { id: string; email: string; refreshToken: string },
  ) {
    const userId = req.id;
    const refreshToken = req.refreshToken;
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
