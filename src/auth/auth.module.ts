import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { ConfigModule } from '../config/config.module';
import { UserModule } from '../users/users.module';
import { MailModule } from '../mail/mail.module';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    MailModule,
    TokenModule,
    ConfigModule.register({ folder: './config' }),
  ],
  providers: [AuthService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
