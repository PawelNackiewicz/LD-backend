import { Injectable, Request } from '@nestjs/common';
import { ICookiesRequest } from './interfaces/cookiesRequest.interface';

@Injectable()
export class CookieService {
  setCookie(req: ICookiesRequest, token: string) {
    req._cookies = [
      {
        name: 'token',
        value: token,
        options: {
          httpOnly: true,
        },
      },
    ];
  }
}
