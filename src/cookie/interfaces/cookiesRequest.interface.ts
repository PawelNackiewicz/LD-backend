import { CookieOptions } from 'express';

export interface CookiesRequest {
  _cookies: Array<{
    name: string;
    value: string;
    options?: CookieOptions;
  }>;
}
