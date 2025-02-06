import { User } from '../../entities/users.entity';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { HashService } from '@lib/hash/hash.service';
import { UserAlreadyExistsError } from './errors/user-already-exists.error';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CreateUserService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Pick<User, 'id'>> {
    await this.throwIfUserAlreadyExists(createUserDto);

    await this.hashUserPassword(createUserDto);

    const { id } = await this.repository.save(createUserDto);
    return { id };
  }

  private async throwIfUserAlreadyExists(
    createUserDto: CreateUserDto,
  ): Promise<void> {
    const { email } = createUserDto;
    const userAlreadyExists = await this.repository.existsBy({ email });
    if (userAlreadyExists) {
      throw new UserAlreadyExistsError();
    }
  }

  private async hashUserPassword(createUserDto: CreateUserDto): Promise<void> {
    createUserDto.password = await this.hashService.hash(
      createUserDto.password,
    );
  }
}
