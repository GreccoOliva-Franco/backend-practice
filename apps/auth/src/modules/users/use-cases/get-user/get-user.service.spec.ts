/**
 * @group app.auth
 * @group ms.auth
 * @group module.users
 * @group integration
 */

import { Repository } from 'typeorm';
import { UsersFactory } from '@apps/auth/modules/users/factories/users.factory';
import { GetUserService } from './get-user.service';
import { User } from '@apps/auth/modules/users/entities/users.entity';
import { Test } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from '@apps/auth/modules/configs/config-module.config';
import { typeOrmModuleOptions } from '@apps/auth/modules/configs/typeorm-config.config';
import { GetUserModule } from './get-user.module';
import { CreateUserDto } from '@apps/auth/modules/users/use-cases/create-user/dtos/create-user.dto';

describe(GetUserService.name, () => {
  const numberOfUsersToInsert = 2;
  const factory = new UsersFactory();
  const usersToDatabase: CreateUserDto[] = factory
    .pick(['email', 'password', 'firstName', 'lastName'])
    .makeMany(numberOfUsersToInsert);
  let service: GetUserService;
  let repository: Repository<User>;
  let usersInDatabase: User[];
  let userInDatabase: User;

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

    await repository.clear();

    usersInDatabase = await repository.save(usersToDatabase);
    userInDatabase = usersInDatabase[0];
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getOne', () => {
    const method = 'getOne';

    it('should be defined', () => {
      expect(service[method]).toBeDefined();
    });

    it('should return null when no user matches', async () => {
      const spy = jest.spyOn(service, method);
      const result = await service[method]({ email: '' });
      if (result) {
        throw new Error(
          'Test conditions do not match test hypotesis: user should not exist',
        );
      }

      expect(spy).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });

    it('should get the targeted user', async () => {
      const spy = jest.spyOn(service, method);
      const email = userInDatabase.email;
      const result = await service[method]({ email });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(User);
      expect(result.email).toBe(email);
    });
  });

  describe('getCredentialsByEmail', () => {
    const method = 'getCredentialsByEmail';

    it('should be defined', () => {
      expect(service[method]).toBeDefined();
    });

    it('should return null if no user is matched', async () => {
      const spy = jest.spyOn(service, method);
      const result = await service[method]('');
      if (result) {
        throw new Error(
          'Test conditions do not match test hypotesis: user should not exist',
        );
      }

      expect(spy).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });

    it('should get the credentials of the targeted user', async () => {
      const spy = jest.spyOn(service, method);
      const { id, email, password } = userInDatabase;
      const result = await service[method](email);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(User);
      expect(result).toMatchObject({ id, email, password });
    });
  });

  describe('getProfileById', () => {
    const method = 'getProfileById';

    it('should be defined', () => {
      expect(service[method]).toBeDefined();
    });

    it('should return null when user does not exist', async () => {
      const spy = jest.spyOn(service, method);
      const idNotInDatabase =
        Math.max(...usersInDatabase.map((user) => user.id)) + 1;
      const result = await service[method](idNotInDatabase);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });

    it('should return profile when user exists', async () => {
      const spy = jest.spyOn(service, method);
      const { id, email, firstName, lastName } = userInDatabase;
      const result = await service[method](id);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(User);
      expect(result).toMatchObject({ id, email, firstName, lastName });
    });
  });
});
