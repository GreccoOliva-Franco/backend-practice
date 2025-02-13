import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  JwtModuleAsyncOptions,
  JwtModuleOptions,
  JwtOptionsFactory,
} from '@nestjs/jwt';

@Injectable()
export class JwtModuleConfigService implements JwtOptionsFactory {
  private readonly algorithm: JwtModuleOptions['signOptions']['algorithm'];
  private readonly issuer: JwtModuleOptions['signOptions']['issuer'];
  private readonly secret: JwtModuleOptions['secret'];

  constructor(private readonly configService: ConfigService) {
    this.algorithm = 'HS256';
    this.issuer = this.configService.get<string>('JWT_ISSUER');
    this.secret = this.configService.get<string>('JWT_SECRET');
  }

  createJwtOptions(): Promise<JwtModuleOptions> | JwtModuleOptions {
    return {
      global: true,
      secret: this.secret,
      signOptions: this.getSignOptions(),
      verifyOptions: this.getVerifyOptions(),
    };
  }

  getSignOptions(): JwtModuleOptions['signOptions'] {
    return {
      algorithm: this.algorithm,
      expiresIn: '24h',
      issuer: this.issuer,
    };
  }

  getVerifyOptions(): JwtModuleOptions['verifyOptions'] {
    return {
      algorithms: [this.algorithm],
      issuer: this.issuer,
    };
  }
}

export const jwtModuleAsyncOptions = {
  global: true,
  useClass: JwtModuleConfigService,
} satisfies JwtModuleAsyncOptions;
