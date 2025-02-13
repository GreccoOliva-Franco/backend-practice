import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class GetUsersService {
  constructor(private readonly prisma: PrismaClient) {}

  getMany(criteria: Prisma.UserFindManyArgs) {
    return this.prisma.user.findMany(criteria);
  }
}
