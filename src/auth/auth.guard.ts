import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TokenService } from '../token/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.tokenService.tokenActiveByToken(request.cookies.token);
  }
}
