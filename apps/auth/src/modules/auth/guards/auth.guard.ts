import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtModuleConfigService } from '@apps/auth/modules/configs/jwt-module.config';
import { AuthTokenPayload } from '@apps/auth/modules/auth/use-cases/sign-in/sign-in.type';
import { ConfigService } from '@nestjs/config';

export enum TOKEN_TYPE {
  BEARER = 'Bearer',
}

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly jwtModuleConfigService: JwtModuleConfigService;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.jwtModuleConfigService = new JwtModuleConfigService(configService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
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

      request['user'] = payload.sub;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const hasAuthorizationHeader = Boolean(request.headers?.authorization);
    if (!hasAuthorizationHeader) {
      return undefined;
    }

    const splitted = request.headers.authorization?.split(' ');
    if (splitted.length > 2) {
      return undefined;
    }

    const type = splitted[0];
    switch (type) {
      case TOKEN_TYPE.BEARER: {
        return this.extractBearerToken(splitted);
      }
      default: {
        return undefined;
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private extractBearerToken([_, token]: string[]): string | undefined {
    return token;
  }
}
