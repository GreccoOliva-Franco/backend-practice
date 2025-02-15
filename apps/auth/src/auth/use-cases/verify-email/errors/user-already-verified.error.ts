import { ConflictException } from '@nestjs/common';

export class UserAlreadyVerifiedError extends ConflictException {
  constructor() {
    super('User is already verified');
  }
}
