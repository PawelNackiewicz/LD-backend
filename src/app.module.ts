import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FacilityModule } from './facility/facility.module';
import { ConfigModule } from './config/config.module';
import { MailModule } from './mail/mail.module';
import { CookieModule } from './cookie/cookie.module';

@Module({
  imports: [
    ConfigModule.register({ folder: './config' }),
    AuthModule,
    UserModule,
    MongooseModule.forRoot('mongodb://localhost/nest'),
    FacilityModule,
    MailModule,
    CookieModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
