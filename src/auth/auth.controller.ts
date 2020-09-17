import { Body, Controller, Get, Patch, Post, Query, Request, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { SetCookies } from '@nestjsplus/cookies/index';
import { CookieService } from '../cookie/cookie.service';
import { IReadableUser } from '../users/interfaces/readable-user.interface';
import { ConfirmAccountDto } from './dto/confirm-account.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  @Post('register')
  async registration(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ): Promise<boolean> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @SetCookies()
  async login(
    @Request() req,
    @Body(new ValidationPipe()) loginDto: LoginDto,
  ): Promise<void> {
    // 6. 7. set cookies
    const accessToken = await this.authService.login(loginDto);
    this.cookieService.setCookie(req, accessToken);
  }

  @Get('session/me')
  async getProfile(@Request() req): Promise<IReadableUser> {
    const token = req.headers.cookie;
    return await this.authService.getUserInfo(token);
  }

  @Get('/confirm')
  async confirm(
    @Query(new ValidationPipe()) query: ConfirmAccountDto,
  ): Promise<boolean> {
    await this.authService.confirmUser(query);
    return true;
  }

  @Post('/forgotPassword')
  async forgotPassword(
    @Body(new ValidationPipe()) forgotPasswordDto: ForgotPasswordDto,
  ): Promise<void> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Patch('/changePassword')
  async changePassword(
    @Body(new ValidationPipe()) changePasswordDto: ChangePasswordDto,
  ): Promise<boolean> {
    return this.authService.changePasswordByToken(changePasswordDto);
  }
}
