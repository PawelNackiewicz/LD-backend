import { Injectable, Request } from '@nestjs/common';
import { CookiesRequest } from './interfaces/cookiesRequest.interface';

@Injectable()
export class CookieService {
  setCookie(req: CookiesRequest, token: string) {
    req._cookies = [
      {
        name: 'token',
        value: token,
        options: {
          httpOnly: true,
        },
      }];
  }
}
