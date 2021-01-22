import { Document } from 'mongoose';
import { roleEnum } from '../enums/role.enums';

export interface UserProps {
  readonly email: string;
  status: string;
  readonly lastName: string;
  readonly firstName: string;
  readonly roles: Array<roleEnum>;
  readonly password: string;
  readonly marketingPermissions: boolean;
}

export type IUser = UserProps & Document
