import { Injectable, Request } from '@nestjs/common';
import { CookiesRequest } from './interfaces/cookiesRequest.interface';

@Injectable()
export class CookieService {
  async setCookie(req: CookiesRequest, token: string) {
    return req._cookies = [
      {
        name: 'token',
        value: token,
        options: {
          httpOnly: true,
        },
      }];
  }
}
