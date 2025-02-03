import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from '../entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  getOne(criteria: FindOptionsWhere<User>): Promise<User | null> {
    return this.repository.findOneBy(criteria);
  }

  getMany(criteria: FindOptionsWhere<User>): Promise<User[]> {
    return this.repository.findBy(criteria);
  }

  getCredentials(criteria: FindOptionsWhere<User>): Promise<User | null> {
    return this.repository.findOne({
      where: criteria,
      select: { email: true, password: true },
    });
  }
}
