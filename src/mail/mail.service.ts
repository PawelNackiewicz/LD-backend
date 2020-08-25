import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '../config/config.service';
import { SendMainInterface } from './interfaces/sendMain.interface';

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

    this.transporter.sendMail(
      options, (error, info) => {
        if (error) {
          return console.log(`error: ${error}`);
        }
        console.log(`Message Sent ${info.response}`);
      });
  }
}
