import { CookieService } from './cookie.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [CookieService],
  exports: [CookieService],
})
export class CookieModule {}
