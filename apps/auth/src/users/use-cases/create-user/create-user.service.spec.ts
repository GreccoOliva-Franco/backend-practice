/**
 * @group app.auth
 * @group ms.auth
 * @group module.users
 * @group integration
 */

import { UsersFactory } from '@apps/auth/users/factories/users.factory';
import { CreateUserService } from './create-user.service';
import { Test } from '@nestjs/testing';
import { CreateUserModule } from './create-user.module';
import { CreateUserDto } from './dtos/create-user.dto';
import { HashService } from '@lib/hash/hash.service';
import { UserAlreadyExistsError } from './errors/user-already-exists.error';
import { PrismaClient } from '@prisma/client';

describe(CreateUserService.name, () => {
  const factory = new UsersFactory();
  const createUserDto: CreateUserDto = factory
    .pick(['email', 'password', 'firstName', 'lastName'])
    .makeOne();
  let service: CreateUserService;
  let datasource: PrismaClient;
  let hashService: HashService;

  beforeAll(async () => {
    const modules = await Test.createTestingModule({
      imports: [CreateUserModule],
    }).compile();

    service = modules.get(CreateUserService);
    datasource = modules.get(PrismaClient);
    hashService = modules.get(HashService);
  });

  beforeEach(async () => {
    jest.clearAllMocks();

    await datasource.user.deleteMany({ where: {} });
  });

  describe('create', () => {
    const method = 'create';

    it('should be defined', () => {
      expect(service[method]).toBeDefined();
    });

    it('should create a user and hash its password', async () => {
      const userEnteredPassword = createUserDto.password;
      const serviceSpy = jest.spyOn(service, method);
      const result = await service[method](createUserDto);

      expect(serviceSpy).toHaveBeenCalledTimes(1);
      expect(result).toHaveProperty('id');
      expect(result.id).toBe(1);

      const userInDatabase = await datasource.user.findFirst({
        where: { email: createUserDto.email },
        select: { password: true },
      });
      expect(userInDatabase).not.toBeNull();
      await expect(
        hashService.compare(userEnteredPassword, userInDatabase.password),
      ).resolves.toBe(true);
    });

    it('should throw error for users with the same email', async () => {
      const serviceSpy = jest.spyOn(service, method);

      await service[method](createUserDto);

      expect(serviceSpy).toHaveBeenCalledTimes(1);
      await expect(service[method](createUserDto)).rejects.toThrow(
        UserAlreadyExistsError,
      );
      expect(serviceSpy).toHaveBeenCalledTimes(2);
    });
  });
});
