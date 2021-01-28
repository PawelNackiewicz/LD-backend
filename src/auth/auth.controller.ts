import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { SetCookies, Cookies } from '@nestjsplus/cookies/index';
import { CookieService } from '../cookie/cookie.service';
import { IReadableUser } from '../users/interfaces/readable-user.interface';
import { ConfirmAccountDto } from './dto/confirm-account.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Create user' })
  async registration(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ): Promise<boolean> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiOperation({ summary: 'Sign in user' })
  @SetCookies()
  async login(
    @Request() req,
    @Body(new ValidationPipe()) loginDto: LoginDto,
  ): Promise<void> {
    const accessToken = await this.authService.login(loginDto);
    this.cookieService.setTokenInCookies(req, accessToken);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get details of logged user' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('session/me')
  async getProfile(@Cookies() cookies): Promise<IReadableUser> {
    return await this.authService.getUserInfo(cookies.token);
  }

  @Get('/confirm')
  @ApiOperation({ summary: 'Confirm registration process' })
  async confirm(
    @Query(new ValidationPipe()) query: ConfirmAccountDto,
  ): Promise<boolean> {
    await this.authService.confirmUser(query);
    return true;
  }

  @Post('/forgotPassword')
  @ApiOperation({ summary: 'Send link with token to reset password of user' })
  async forgotPassword(
    @Body(new ValidationPipe()) forgotPasswordDto: ForgotPasswordDto,
  ): Promise<void> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Patch('/changePassword')
  @ApiOperation({ summary: 'Change password of user' })
  async changePassword(
    @Body(new ValidationPipe()) changePasswordDto: ChangePasswordDto,
  ): Promise<boolean> {
    return this.authService.changePasswordByToken(changePasswordDto);
  }
}
