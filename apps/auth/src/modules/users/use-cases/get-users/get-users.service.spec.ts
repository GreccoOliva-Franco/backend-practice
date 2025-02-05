/**
 * @group app.auth
 * @group ms.auth
 * @group module.users
 * @group integration
 */

import { Test } from '@nestjs/testing';
import { GetUsersService } from './get-users.service';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from '@apps/auth/modules/configs/config-module.config';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from '@apps/auth/modules/configs/typeorm-config.config';
import { User } from '@apps/auth/modules/users/entities/users.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UsersFactory } from '@apps/auth/modules/users/factories/users.factory';
import { GetUsersModule } from './get-users.module';

describe(GetUsersService.name, () => {
  const numberOfUsersToTest: number = 2;
  const factory = new UsersFactory();
  let service: GetUsersService;
  let repository: Repository<User>;
  let usersInDatabase: User[];
  let userInDatabase: User;

  beforeAll(async () => {
    const modules = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(configModuleOptions),
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
        GetUsersModule,
      ],
    }).compile();

    service = modules.get(GetUsersService);
    repository = modules.get(getRepositoryToken(User));

    await (async function createDatabaseState(): Promise<void> {
      await repository.clear();

      const usersToDatabase = factory
        .pick(['email', 'password', 'firstName', 'lastName'])
        .makeMany(numberOfUsersToTest);
      usersInDatabase = await repository.save(usersToDatabase);
      userInDatabase = usersInDatabase[0];
    })();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMany', () => {
    const method = 'getMany';

    it('should be defined', () => {
      expect(service[method]).toBeDefined();
    });

    it('should retrieve all users', async () => {
      const spy = jest.spyOn(service, method);
      const result = await service[method]({});

      expect(spy).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(usersInDatabase.length);
      result.forEach((user, index) => {
        expect(user).toBeInstanceOf(User);
        expect(user.email).toBe(usersInDatabase[index].email);
        expect(user.firstName).toBe(usersInDatabase[index].firstName);
        expect(user.lastName).toBe(usersInDatabase[index].lastName);
      });
    });

    it('should retrieve only one user when using a filter on unique properties', async () => {
      const spy = jest.spyOn(service, method);
      const { email } = userInDatabase;
      const criteria = { email } satisfies FindOptionsWhere<User>;
      const result = await service[method](criteria);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(1);
      result.forEach((user) => {
        expect(user).toBeInstanceOf(User);
        expect(user.email).toBe(email);
      });
    });

    it('should retrieve no users when no user matches', async () => {
      const spy = jest.spyOn(service, method);
      const result = await service[method]({ email: '' });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(0);
    });
  });
});
