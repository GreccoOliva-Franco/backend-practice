import { User } from '../../entities/users.entity';
import { Injectable } from '@nestjs/common';
import { UsersMutateRepository } from '../../repositories/mutate.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { HashService } from '@lib/hash/hash.service';
import { UsersQueryRepository } from '../../repositories/query.repository';
import { UserAlreadyExistsError } from './errors/user-already-exists.error';

@Injectable()
export class CreateUserService {
  constructor(
    private readonly queryRepository: UsersQueryRepository,
    private readonly mutateRepository: UsersMutateRepository,
    private readonly hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Pick<User, 'id'>> {
    const user = await this.queryRepository.getOne({
      email: createUserDto.email,
    });
    if (user) {
      throw new UserAlreadyExistsError();
    }
    await this.hashUserPassword(createUserDto);
    const userCreated = await this.mutateRepository.create(createUserDto);
    return { id: userCreated.id };
  }

  private async hashUserPassword(createUserDto: CreateUserDto): Promise<void> {
    createUserDto.password = await this.hashService.hash(
      createUserDto.password,
    );
  }
}
