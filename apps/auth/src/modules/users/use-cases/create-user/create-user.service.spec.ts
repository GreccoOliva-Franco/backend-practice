/**
 * @group app.auth
 * @group ms.auth
 * @group module.users
 * @group integration
 */

import { Repository } from 'typeorm';
import { UsersFactory } from '../../factories/users.factory';
import { CreateUserService } from './create-user.service';
import { User } from '../../entities/users.entity';
import { Test } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from '../../../configs/config-module.config';
import { typeOrmModuleOptions } from '../../../configs/typeorm-config.config';
import { CreateUserModule } from './create-user.module';
import { CreateUserDto } from './dtos/create-user.dto';
import { HashService } from '@lib/hash/hash.service';
import { UserAlreadyExistsError } from './errors/user-already-exists.error';

describe(CreateUserService.name, () => {
  const factory = new UsersFactory();
  let service: CreateUserService;
  let repository: Repository<User>;
  let hashService: HashService;

  beforeAll(async () => {
    const modules = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(configModuleOptions),
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
        CreateUserModule,
      ],
    }).compile();

    service = modules.get(CreateUserService);
    repository = modules.get(getRepositoryToken(User));
    hashService = modules.get(HashService);
  });

  beforeEach(async () => {
    jest.clearAllMocks();

    await repository.clear();
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(service.create).toBeDefined();
    });

    it('should create a user and hash its password', async () => {
      const userToCreate = factory
        .pick(['email', 'password', 'firstName', 'lastName'])
        .makeOne() satisfies CreateUserDto;
      const userEnteredPassword = userToCreate.password;
      const serviceSpy = jest.spyOn(service, 'create');
      const result = await service.create(userToCreate);

      expect(serviceSpy).toHaveBeenCalledTimes(1);
      expect(result).toHaveProperty('id');
      expect(result.id).toBe(1);

      const userInDatabase = await repository.findOneOrFail({
        where: { email: userToCreate.email },
        select: { email: true, password: true },
      });
      expect(
        hashService.compare(userEnteredPassword, userInDatabase.password),
      ).resolves.toBe(true);
    });

    it('should throw error on duplicate user.email', async () => {
      const serviceSpy = jest.spyOn(service, 'create');
      const userToCreate = factory
        .pick(['email', 'password', 'firstName', 'lastName'])
        .makeOne() satisfies CreateUserDto;

      await service.create(userToCreate);

      expect(serviceSpy).toHaveBeenCalledTimes(1);
      expect(service.create(userToCreate)).rejects.toThrow(
        UserAlreadyExistsError,
      );
      expect(serviceSpy).toHaveBeenCalledTimes(2);
    });
  });
});
