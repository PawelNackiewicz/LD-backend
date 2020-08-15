import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { IReadableUser } from '../users/interfaces/readable-user.interface';
import { SetCookies } from '@nestjsplus/cookies/index';
import { CookieService } from '../cookie/cookie.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly cookieService: CookieService) {}

  @Post('register')
  async signUp(@Body(new ValidationPipe()) createUserDto: CreateUserDto): Promise<boolean> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @SetCookies()
  async login(@Request() req, @Body(new ValidationPipe()) loginDto: LoginDto): Promise<IReadableUser> {
    // 6. 7. set cookies
    const user = await this.authService.login(loginDto);
    await this.cookieService.setCookie(req, user.accessToken);
    return user;
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
