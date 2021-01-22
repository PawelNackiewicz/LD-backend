import { roleEnum } from '../enums/role.enums';

export interface IReadableUser {
  readonly _id: string
  readonly email: string;
  status: string;
  readonly lastName: string;
  readonly firstName: string;
  readonly roles: Array<roleEnum>;
  accessToken?: string;
}
