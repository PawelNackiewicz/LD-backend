export interface IReadableUser {
  readonly email: string;
  status?: string;
  readonly lastName: string;
  readonly firstName: string;
  readonly roles: Array<string>;
  accessToken?: string;
}
