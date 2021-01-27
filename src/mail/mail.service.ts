import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '../config/config.service';
import { SendMainInterface } from './interfaces/sendMain.interface';
import { IUser } from '../users/interfaces/user.interface';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('DOMAIN_EMAIL'),
        pass: this.configService.get('DOMAIN_EMAIL_PASSWORD'),
      },
    });
  }

  sendMail({ to, subject, content }: SendMainInterface) {
    let options = {
      from: this.configService.get('DOMAIN_EMAIL'),
      to: to,
      subject: subject,
      html: content,
    };

    this.transporter.sendMail(options, (error, info) => {
      if (error) {
        return console.log(`error: ${error}`);
      }
      console.log(`Message Sent ${info.response}`);
    });
  }

  async sendConfirmationMail(user: IUser, confirmLink) {
    await this.sendMail({
      to: user.email,
      subject: 'Potwierdzenie rejestracji',
      content: `
                <h3>Cześć, ${user.firstName}!</h3>
                <p>Aby potwierdzić swoje konto i w pełni korzystać z serwisu, wejdź w  ten <a href="${confirmLink}">link</a>.</p>
            `,
    });
  }

  async sendForgotPasswordMail(user: IUser, forgotLink) {
    await this.sendMail({
      to: user.email,
      subject: 'Przypomnienie hasła',
      content: `
                <h3>Cześć ${user.firstName}!</h3>
                <p>Aby zresetować swoje hasło kliknij w <a href="${forgotLink}">link</a>.</p>
               `,
    });
  }
}
