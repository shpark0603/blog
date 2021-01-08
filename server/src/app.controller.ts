import {
  Controller,
  Post,
  UseGuards,
  Get,
  Req,
  Res,
  Body,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { RegisterUserDto } from './users/dto/register-user.dto';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Req() req: Request, @Res() res: Response) {
    const accessToken = await this.authService.generateAccessToken(req.user);
    res
      .cookie('access_token', accessToken, {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
      })
      .send();
  }

  @Post('auth/register')
  async register(@Body() body: RegisterUserDto, @Res() res: Response) {
    const user = await this.usersService.register(body.username, body.password);
    const accessToken = await this.authService.generateAccessToken(user);
    res
      .cookie('access_token', accessToken, {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
      })
      .send();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
