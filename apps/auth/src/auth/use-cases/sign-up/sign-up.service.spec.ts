/**
 * @group app.auth
 * @group ms.auth
 * @group module.auth
 * @group integration
 */

import { Test } from '@nestjs/testing';
import { SignUpModule } from './sign-up.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from '@apps/auth/configs/typeorm-config.config';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from '@apps/auth/configs/config-module.config';
import { SignUpDto } from './dtos/sign-up.dto';
import { UsersFactory } from '@apps/auth/users/factories/users.factory';
import { User } from '@apps/auth/users/entities/users.entity';
import { Repository } from 'typeorm';
import { UserAlreadyExistsError } from './errors/user-already-exists.error';
import { SignUpService } from './sign-up.service';
import { CreateUserService } from '@apps/auth/users/use-cases/create-user/create-user.service';
import { InternalServerErrorException } from '@nestjs/common';

describe(SignUpService.name, () => {
  const method = 'execute';
  const factory = new UsersFactory();
  const signUpDtoFields: (keyof SignUpDto)[] = [
    'email',
    'password',
    'firstName',
    'lastName',
  ];
  let service: SignUpService;
  let repository: Repository<User>;
  let createUserService: CreateUserService;

  beforeAll(async () => {
    const modules = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(configModuleOptions),
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),

        SignUpModule,
      ],
    }).compile();

    service = modules.get(SignUpService);
    createUserService = modules.get(CreateUserService);
    repository = modules.get(getRepositoryToken(User));
  });

  beforeEach(async () => {
    jest.clearAllMocks();

    await repository.clear();
  });

  describe(method, () => {
    it('should be defined', () => {
      expect(service[method]).toBeDefined();
    });

    it('should create a user', async () => {
      const signUpDto: SignUpDto = factory.pick(signUpDtoFields).makeOne();
      const spy = jest.spyOn(service, method);

      const result = await service[method](signUpDto);
      const userInDatabase = await repository.findOneBy({
        email: signUpDto.email,
      });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
      expect(userInDatabase).toBeDefined();
    });

    it('should throw when user already exists', async () => {
      const signUpDto: SignUpDto = factory.pick(signUpDtoFields).makeOne();
      const spy = jest.spyOn(service, method);

      await service[method](signUpDto);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(service[method](signUpDto)).rejects.toThrow(
        UserAlreadyExistsError,
      );
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should throw Internal Server Error if an uncaught error occurs', async () => {
      const signUpDto: SignUpDto = factory.pick(signUpDtoFields).makeOne();
      const serviceSpy = jest.spyOn(service, method);
      const createUserServiceSpy = jest
        .spyOn(createUserService, 'create')
        .mockImplementation(() => {
          throw new Error('some uncaught error');
        });

      expect(service[method](signUpDto)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(serviceSpy).toHaveBeenCalledTimes(1);
      expect(createUserServiceSpy).toHaveBeenCalledTimes(1);
    });
  });
});
