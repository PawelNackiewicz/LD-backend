import { Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { IUser} from '../users/interfaces/user.interface';
import { ConfigService } from '../config/config.service';
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
}
