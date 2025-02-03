import { FindOptionsWhere } from 'typeorm';
import { UsersQueryRepository } from '../../repositories/query.repository';
import { User } from '../../entities/users.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetUserService {
  constructor(private readonly repository: UsersQueryRepository) {}

  getOne(criteria: FindOptionsWhere<User | null>): Promise<User | null> {
    return this.repository.getOne(criteria);
  }

  getCredentialsByEmail(email: User['email']): Promise<User | null> {
    return this.getCredentials({ email });
  }

  private getCredentials(
    criteria: FindOptionsWhere<User>,
  ): Promise<User | null> {
    return this.repository.getCredentials(criteria);
  }
}
