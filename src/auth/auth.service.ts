import { Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { IUser} from '../users/interfaces/user.interface';
import { ConfigService } from '../config/config.service';
import { ForgotPasswordDto } from './model/forgot-password.dto';
import { ChangePasswordDto } from './model/change-passwrod.dto';
import { TokenService } from '../token/token.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { roleEnum } from '../users/enums/role.enums';
import { LoginDto } from './model/login.dto';

type LoginSuccessResponse = {
  access_token: string;
};

@Injectable()
export class AuthService {
  private readonly clientAppUrl: string;

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
    private configService: ConfigService,
    private tokenService: TokenService
  ) {
    this.clientAppUrl = this.configService.get('DOMAIN_MAIL');
  }

  async validateUser(email: string, password: string): Promise<IUser> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user; //get all data about user without password
      return user;
    }
  }

  login(user: LoginDto): LoginSuccessResponse {
    const payload = { email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto): Promise<boolean> {
    const user = await this.userService.create(createUserDto, [roleEnum.user]);
    // await this.sendConfirmation(user);
    return true;
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<boolean> {
    const password = await this.userService.hashPassword(changePasswordDto.password);

    await this.userService.update(userId, { password });
    await this.tokenService.deleteAll(userId);
    return true;
  }

  async sendConfirmation(user: IUser) {
    const token = await this.login(user);
    const confirmLink = `${this.clientAppUrl}/auth/confirm?token=${token}`;
    await this.mailService.send({
      from: this.configService.get('DOMAIN_MAIL'),
      to: user.email,
      subject: 'Verify User',
      html: `
                <h3>Hello ${user.email}!</h3>
                <p>Please use this <a href="${confirmLink}">link</a> to confirm your account.</p>
            `,
    });
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    try {
      const user = await this.userService.findByEmail(forgotPasswordDto.email);
      const token = await this.login(user);
      const forgotLink = `${this.clientAppUrl}/auth/forgotPassword?token=${token}`;

      await this.mailService.send({
        from: this.configService.get('DOMAIN_MAIL'),
        to: user.email,
        subject: 'Forgot Password',
        html: `
                <h3>Hello ${user.email}!</h3>
                <p>Please use this <a href="${forgotLink}">link</a> to reset your password.</p>
            `,
      });
    } catch (e) {
      console.error(e);
    }
  }
}
