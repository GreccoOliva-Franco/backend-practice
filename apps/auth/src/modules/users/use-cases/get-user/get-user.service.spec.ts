/**
 * @group auth-ms
 * @group users
 * @group integration
 */

import { Repository } from 'typeorm';
import { UsersFactory } from '../../factories/users.factory';
import { GetUserService } from './get-user.service';
import { User } from '../../entities/users.entity';
import { Test } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from '../../../configs/config-module.config';
import { typeOrmModuleOptions } from '../../../configs/typeorm-config.config';
import { GetUserModule } from './get-user.module';

describe(GetUserService.name, () => {
  const numberOfUsersToInsert = 2;
  const factory = new UsersFactory();
  let service: GetUserService;
  let repository: Repository<User>;
  let usersInDatabase: User[];

  beforeAll(async () => {
    const modules = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(configModuleOptions),
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
        GetUserModule,
      ],
    }).compile();

    service = modules.get(GetUserService);
    repository = modules.get(getRepositoryToken(User));

    await (async function createDatabaseState(): Promise<void> {
      await repository.clear();

      const usersToDatabase = factory
        .pick(['email', 'password', 'firstName', 'lastName'])
        .makeMany(numberOfUsersToInsert);
      usersInDatabase = await repository.save(usersToDatabase);
    })();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getOne', () => {
    it('should be defined', () => {
      expect(service.getOne).toBeDefined();
    });

    it('should return null when no user matches', async () => {
      const serviceSpy = jest.spyOn(service, 'getOne');
      const result = await service.getOne({ email: '' });
      if (result) {
        throw new Error(
          'Test conditions do not match test hypotesis: user should not exist',
        );
      }

      expect(serviceSpy).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });

    it('should get the targeted user', async () => {
      const serviceSpy = jest.spyOn(service, 'getOne');
      const email = usersInDatabase[0].email;
      const result = await service.getOne({ email });

      expect(serviceSpy).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(User);
      expect(result.email).toBe(email);
    });
  });

  describe('getCredentialsByEmail', () => {
    it('should be defined', () => {
      expect(service.getCredentialsByEmail).toBeDefined();
    });

    it('should return null if no user is matched', async () => {
      const serviceSpy = jest.spyOn(service, 'getCredentialsByEmail');
      const result = await service.getCredentialsByEmail('');
      if (result) {
        throw new Error(
          'Test conditions do not match test hypotesis: user should not exist',
        );
      }

      expect(serviceSpy).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });

    it('should get the credentials of the targeted user', async () => {
      const serviceSpy = jest.spyOn(service, 'getCredentialsByEmail');
      const targetUser = usersInDatabase[0];
      const result = await service.getCredentialsByEmail(targetUser.email);

      expect(serviceSpy).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(User);
      expect(result).toMatchObject({
        email: targetUser.email,
        password: targetUser.password,
      });
    });
  });
});
