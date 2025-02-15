import { UnauthorizedException } from '@nestjs/common';

export class InvalidTokenPayloadError extends UnauthorizedException {
  constructor() {
    super('Invalid token payload');
  }
}
