import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtModuleConfigService } from '@apps/auth/configs/jwt-module.config';
import { AuthTokenPayload } from '@apps/auth/auth/use-cases/sign-in/sign-in.type';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_ENDPOINT } from './public.guard';

export enum TOKEN_TYPE {
  BEARER = 'Bearer',
}

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly jwtModuleConfigService: JwtModuleConfigService;

  constructor(
    configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {
    this.jwtModuleConfigService = new JwtModuleConfigService(configService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.isPublicEndpoint(context)) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const verifyOptions = this.jwtModuleConfigService.getVerifyOptions();
      const payload = await this.jwtService.verifyAsync<AuthTokenPayload>(
        token,
        verifyOptions,
      );

      request['user'] = payload.user;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private isPublicEndpoint(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_ENDPOINT, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers?.authorization?.split(' ') || [];
    if (type !== TOKEN_TYPE.BEARER) {
      return undefined;
    }

    return token || undefined;
  }
}
