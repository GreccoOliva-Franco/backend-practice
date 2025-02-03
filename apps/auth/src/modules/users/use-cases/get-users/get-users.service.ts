import { Injectable } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { UsersQueryRepository } from '../../repositories/query.repository';
import { User } from '../../entities/users.entity';

@Injectable()
export class GetUsersService {
  constructor(private readonly repository: UsersQueryRepository) {}

  getMany(criteria: FindOptionsWhere<User>): Promise<User[]> {
    return this.repository.getMany(criteria);
  }
}
