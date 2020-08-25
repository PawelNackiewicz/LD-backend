import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { MailService } from '../mail/mail.service';
import { IUser } from '../users/interfaces/user.interface';
import { ConfigService } from '../config/config.service';
import { TokenService } from '../token/token.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JWE, JWK, JWT } from 'jose';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { roleEnum } from '../users/enums/role.enums';
import { IReadableUser } from '../users/interfaces/readable-user.interface';
import { statusEnum } from '../users/enums/status.enums';
import * as _ from 'lodash';
import * as moment from 'moment';
import { CreateUserTokenDto } from '../token/dto/create-user-token.dto';
import { userSensitiveFieldsEnum } from '../users/enums/protected-fields.enum';
import { LoginDto } from './dto/login.dto';

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
    const token = await this.tokenService.getRegistrationToken(user.email);
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
