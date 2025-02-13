import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { HashService } from '@lib/hash/hash.service';
import { UserAlreadyExistsError } from './errors/user-already-exists.error';
import { PrismaClient } from '@prisma/client';
import { CreatedUser } from './create-user.types';

@Injectable()
export class CreateUserService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<CreatedUser> {
    await this.throwIfUserAlreadyExists(createUserDto);

    await this.hashUserPassword(createUserDto);

    const user = await this.prisma.user.create({
      data: createUserDto,
      select: { id: true, email: true, firstName: true, lastName: true },
    });

    return user;
  }

  private async throwIfUserAlreadyExists(
    createUserDto: CreateUserDto,
  ): Promise<void> {
    const userAlreadyExists = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (userAlreadyExists) {
      throw new UserAlreadyExistsError();
    }
  }

  private async hashUserPassword(createUserDto: CreateUserDto): Promise<void> {
    const hashedPassword = await this.hashService.hash(createUserDto.password);
    createUserDto.password = hashedPassword;
  }
}
