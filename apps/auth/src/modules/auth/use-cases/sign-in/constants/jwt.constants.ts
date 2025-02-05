import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  JwtModuleAsyncOptions,
  JwtSignOptions,
  JwtVerifyOptions,
} from '@nestjs/jwt';

export const jwtModuleAsyncOptions: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => {
    const secret = configService.get<string>('JWT_SECRET');
    const issuer = configService.get<string>('JWT_ISSUER');

    return {
      secret,
      signOptions: { ...baseSignInOptions, issuer },
      verifyOptions: { ...baseVerifyOptions, issuer },
    };
  },
  inject: [ConfigService],
};

const algorithm: JwtSignOptions['algorithm'] = 'HS256';

const baseSignInOptions: JwtSignOptions = {
  algorithm,
  expiresIn: '1 day',
};

const baseVerifyOptions: JwtVerifyOptions = {
  algorithms: [algorithm],
  complete: true,
};
