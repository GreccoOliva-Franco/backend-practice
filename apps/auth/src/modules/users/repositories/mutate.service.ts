import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';
import { Repository, UpdateResult } from 'typeorm';

export class UsersMutateRepository {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  create(newUser: Partial<User>): Promise<User> {
    return this.repository.save(newUser);
  }

  updateById(id: User['id'], update: Partial<User>): Promise<UpdateResult> {
    return this.repository.update({ id }, update);
  }
}
