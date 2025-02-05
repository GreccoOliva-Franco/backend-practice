import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from '@apps/auth/modules/users/entities/users.entity';
import { Injectable } from '@nestjs/common';
import { UserCredentials, UserProfile } from './get-user.types';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GetUserService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  getOne(criteria: FindOptionsWhere<User | null>): Promise<User | null> {
    return this.repository.findOneBy(criteria);
  }

  getCredentialsByEmail(email: User['email']): Promise<UserCredentials | null> {
    return this.getCredentials({ email });
  }

  getProfileById(id: User['id']): Promise<UserProfile | null> {
    return this.getProfileBy({ id });
  }

  private getCredentials(
    criteria: FindOptionsWhere<User>,
  ): Promise<UserCredentials | null> {
    return this.repository.findOne({
      where: criteria,
      select: { id: true, email: true, password: true },
    });
  }

  private getProfileBy(
    criteria: FindOptionsWhere<User>,
  ): Promise<UserProfile | null> {
    return this.repository.findOne({
      where: criteria,
      select: { id: true, email: true, firstName: true, lastName: true },
    });
  }
}
