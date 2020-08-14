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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async signUp(@Body(new ValidationPipe()) createUserDto: CreateUserDto): Promise<boolean> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @SetCookies({name: 'token', value: 'token'})
  async login(@Request() req, @Body(new ValidationPipe()) loginDto: LoginDto): Promise<IReadableUser> {
    const user = await this.authService.login(loginDto);
    req._cookies = [
      {
        name: 'token',
        value: user.accessToken,
        options: {
          secure: true,
          httpOnly: true,
        },
      }];
    return user;
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
