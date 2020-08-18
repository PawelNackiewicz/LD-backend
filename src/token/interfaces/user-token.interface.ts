import { Document } from 'mongoose';

export interface IUserToken extends Document {
  readonly token: string;
  readonly userId: string;
  readonly expireAt: string;
}
