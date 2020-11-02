import { Document } from 'mongoose';

export interface UserProps {
  readonly email: string;
  status?: string;
  readonly lastName: string;
  readonly firstName: string;
  readonly roles: Array<string>;
  readonly password: string;
  readonly marketingPermissions?: boolean;
}

export type IUser = UserProps & Document
