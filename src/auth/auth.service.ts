import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { MailService } from '../mail/mail.service';
import { IUser } from '../users/interfaces/user.interface';
import { ConfigService } from '../config/config.service';
import { TokenService } from '../token/token.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { roleEnum } from '../users/enums/role.enums';
import { IReadableUser } from '../users/interfaces/readable-user.interface';
import { statusEnum } from '../users/enums/status.enums';
import * as _ from 'lodash';
import { userSensitiveFieldsEnum } from '../users/enums/protected-fields.enum';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ConfirmAccountDto } from './dto/confirm-account.dto';
import { ITokenPayload } from '../token/interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  private readonly clientAppUrl: string;

  constructor(
    private userService: UserService,
    private mailService: MailService,
    private configService: ConfigService,
    private tokenService: TokenService,
  ) {
    this.clientAppUrl = this.configService.get('DOMAIN');
  }

  async login({ email, password }: LoginDto): Promise<IReadableUser> {
    //2. check if is cookie to authentication

    //3. check if user with this login and hash password exist
    const user = await this.userService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = await this.tokenService.signUser(user);
      const readableUser = user.toObject() as IReadableUser;
      readableUser.accessToken = token;

      // TODO remove lodash
      return _.omit<any>(readableUser, Object.values(userSensitiveFieldsEnum)) as IReadableUser;
    }
    throw new NotFoundException('Invalid credentials');
  }

  async register(createUserDto: CreateUserDto): Promise<boolean> {
    const user = await this.userService.create(createUserDto, [roleEnum.user]);
    await this.sendConfirmation(user);
    return true;
  }

  async sendConfirmation(user: IUser) {
    const token = await this.tokenService.getActivationToken(user.email);
    const confirmLink = `${this.clientAppUrl}/auth/confirm?token=${token}`;
    console.log(confirmLink);
    await this.mailService.sendMail({
      to: user.email,
      subject: 'Potwierdzenie rejestracji',
      content: `
                <h3>Cześć, ${user.firstName}!</h3>
                <p>Aby potwierdzić swoje konto i w pełni korzystać z serwisu, wejdź w  ten <a href="${confirmLink}">link</a>.</p>
            `,
    });
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const user = await this.userService.findByEmail(forgotPasswordDto.email);
    if (!user) {
      // TODO change correct not found
      throw new NotFoundException('Invalid email');
    }
    const token = await this.tokenService.getActivationToken(user.email);
    const forgotLink = `${this.clientAppUrl}/auth/forgotPassword?token=${token}`;

    await this.mailService.sendMail({
      to: user.email,
      subject: 'Forgot Password',
      content: `
                <h3>Hello ${user.firstName}!</h3>
                <p>Please use this <a href="${forgotLink}">link</a> to reset your password.</p>
            `,
    });
  }

  async confirmUser({ token }: ConfirmAccountDto) {
    const data = await this.tokenService.verifyActivationToken(token) as ITokenPayload;
    const user = await this.userService.findByEmail(data.userEmail);

    if (user && user.status === statusEnum.pending) {
      user.status = statusEnum.active;
      return user.save();
    }
    // TODO change correct not found
    throw new NotFoundException('Confirmation error');
  }

  async getUserInfo(token: string): Promise<IReadableUser> {
    const userId = await this.tokenService.getUserId(this.parseToken(token));
    return await this.userService.find(userId);
  }

  parseToken(token: string): string {
    const prefix = 'token=';
    if (token.includes(prefix)) return token.split(prefix).pop();
    return token;
  }
}
