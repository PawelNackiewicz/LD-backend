import { roleEnum } from '../enums/role';

export interface ReadableUser {
  readonly _id: string;
  readonly email: string;
  status: string;
  readonly lastName: string;
  readonly firstName: string;
  readonly roles: Array<roleEnum>;
  accessToken?: string;
}
