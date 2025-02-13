import { User } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { UserCredentials, UserProfile } from './get-user.types';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class GetUserService {
  constructor(private readonly prisma: PrismaClient) {}

  getOne(criteria: Prisma.UserFindFirstArgs) {
    return this.prisma.user.findFirst(criteria);
  }

  getCredentialsByEmail(email: User['email']): Promise<UserCredentials | null> {
    return this.getCredentials({ email });
  }

  getProfileById(id: User['id']): Promise<UserProfile | null> {
    return this.getProfileBy({ id });
  }

  private getCredentials(criteria): Promise<UserCredentials | null> {
    return this.prisma.user.findUnique({
      where: criteria,
      select: { id: true, email: true, password: true },
    });
  }

  private getProfileBy(criteria): Promise<UserProfile | null> {
    return this.prisma.user.findFirst({
      where: criteria,
      select: { id: true, email: true, firstName: true, lastName: true },
    });
  }
}
