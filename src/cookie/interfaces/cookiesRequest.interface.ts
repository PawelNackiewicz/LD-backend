import { CookieOptions } from 'express';

export interface ICookiesRequest {
  _cookies: Array<{
    name: string;
    value: string;
    options?: CookieOptions;
  }>;
}
