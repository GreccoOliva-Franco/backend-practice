import { NotFoundException } from '@nestjs/common';

export class UserDoesNotExistError extends NotFoundException {
  constructor() {
    super('User does not exist');
  }
}
