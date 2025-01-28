import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  private readonly ROUNDS: number = 15 as const;

  hash(input: string): Promise<string> {
    return bcrypt.hash(input, this.ROUNDS);
  }

  compare(rawInput: string, encrypted: string): Promise<boolean> {
    return bcrypt.compare(rawInput, encrypted);
  }
}
