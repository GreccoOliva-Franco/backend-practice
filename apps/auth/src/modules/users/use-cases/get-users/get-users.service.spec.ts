/**
 * @group auth-ms
 * @group users
 * @group integration
 */

import { Test } from '@nestjs/testing';
import { GetUsersService } from './get-users.service';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from '../../../configs/config-module.config';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from '../../../configs/typeorm-config.config';
import { User } from '../../entities/users.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UsersFactory } from '../../factories/users.factory';
import { GetUsersModule } from './get-users.module';

describe(GetUsersService.name, () => {
  const numberOfUsersToTest: number = 2;
  const factory = new UsersFactory();
  let service: GetUsersService;
  let repository: Repository<User>;
  let usersInDatabase: User[];

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
    })();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMany', () => {
    it('should be defined', () => {
      expect(service.getMany).toBeDefined();
    });

    it('should retrieve all users', async () => {
      const serviceSpy = jest.spyOn(service, 'getMany');
      const result = await service.getMany({});

      expect(serviceSpy).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(usersInDatabase.length);
      result.forEach((user, index) => {
        expect(user).toBeInstanceOf(User);
        expect(user.email).toBe(usersInDatabase[index].email);
        expect(user.firstName).toBe(usersInDatabase[index].firstName);
        expect(user.lastName).toBe(usersInDatabase[index].lastName);
      });
    });

    it('should retrieve only one user when using a filter on unique properties', async () => {
      const serviceSpy = jest.spyOn(service, 'getMany');
      const criteria = {
        email: usersInDatabase[0].email,
      } satisfies FindOptionsWhere<User>;
      const result = await service.getMany(criteria);

      expect(serviceSpy).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(1);
      result.forEach((user) => {
        expect(user).toBeInstanceOf(User);
        expect(user.email).toBe(criteria.email);
      });
    });
  });
});
