import { Body, Controller, Get, Post, Request, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { SetCookies } from '@nestjsplus/cookies/index';
import { CookieService } from '../cookie/cookie.service';
import { IReadableUser } from '../users/interfaces/readable-user.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly cookieService: CookieService) {
  }

  @Post('register')
  async registration(@Body(new ValidationPipe()) createUserDto: CreateUserDto): Promise<boolean> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @SetCookies()
  async login(@Request() req, @Body(new ValidationPipe()) loginDto: LoginDto): Promise<void> {
    // 6. 7. set cookies
    const user = await this.authService.login(loginDto);
    this.cookieService.setCookie(req, user.accessToken);
  }

  @Get('session/me')
  async getProfile(@Request() req): Promise<IReadableUser> {
    const token = req.headers.cookie;
    return await this.authService.getUserInfo(token);
  }
}
