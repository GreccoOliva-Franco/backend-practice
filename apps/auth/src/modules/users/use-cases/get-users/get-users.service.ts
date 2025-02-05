import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from '@apps/auth/modules/users/entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GetUsersService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  getMany(criteria: FindOptionsWhere<User>): Promise<User[]> {
    return this.repository.findBy(criteria);
  }
}
