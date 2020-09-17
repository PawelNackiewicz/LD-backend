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
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ConfirmAccountDto } from './dto/confirm-account.dto';
import { ITokenPayload } from '../token/interfaces/token-payload.interface';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  private readonly clientAppUrl: string;

  constructor(
    private userService: UserService,
    private mailService: MailService,
    private configService: ConfigService,
    private tokenService: TokenService,
  ) {
    this.clientAppUrl = this.configService.get('FE_APP_URL');
  }

  async login({ email, password }: LoginDto): Promise<string> {
    //2. check if is cookie to authentication

    //3. check if user with this login and hash password exist
    const user = await this.userService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      return await this.tokenService.signUser(user);
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
    if (!user) return;
    const token = await this.tokenService.getActivationToken(user.email);
    const forgotLink = `${this.clientAppUrl}/auth/resetPassword?token=${token}`;

    await this.mailService.sendMail({
      to: user.email,
      subject: 'Forgot Password',
      content: `
                <h3>Cześć ${user.firstName}!</h3>
                <p>Aby zresetować swoje hasło kliknij w <a href="${forgotLink}">link</a>.</p>
            `,
    });
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<boolean> {
    const password = await this.userService.hashPassword(
      changePasswordDto.password,
    );

    await this.userService.update(userId, { password });
    await this.tokenService.deleteAll(userId);
    return true;
  }

  async changePasswordByToken(
    changePasswordDto: ChangePasswordDto,
  ): Promise<boolean> {
    const password = await this.userService.hashPassword(
      changePasswordDto.password,
    );
    const data = (await this.tokenService.verifyActivationToken(
      AuthService.parseToken(changePasswordDto.token),
    )) as ITokenPayload;
    const user = await this.userService.findByEmail(data.userEmail);
    await this.userService.update(user._id, { password });
    await this.tokenService.deleteAll(user._id);
    return true;
  }

  async confirmUser({ token }: ConfirmAccountDto) {
    const data = (await this.tokenService.verifyActivationToken(
      token,
    )) as ITokenPayload;
    const user = await this.userService.findByEmail(data.userEmail);

    if (user && user.status === statusEnum.pending) {
      user.status = statusEnum.active;
      return user.save();
    }
    throw new NotFoundException('Confirmation error');
  }

  async getUserInfo(token: string): Promise<IReadableUser> {
    const userId = await this.tokenService.getUserId(
      AuthService.parseToken(token),
    );
    return await this.userService.find(userId);
  }

  private static parseToken(token: string): string {
    const prefix = 'token=';
    if (token.includes(prefix)) return token.split(prefix).pop();
    return token;
  }
}
