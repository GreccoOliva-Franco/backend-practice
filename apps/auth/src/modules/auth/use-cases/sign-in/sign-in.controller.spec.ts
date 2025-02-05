/**
 * @group app.auth
 * @group ms.auth
 * @group module.auth
 * @group integration
 */

import { UsersFactory } from '@apps/auth/modules/users/factories/users.factory';
import { SignInController } from './sign-in.controller';
import { Test } from '@nestjs/testing';
import { SignInModule } from './sign-in.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@apps/auth/modules/users/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserService } from '@apps/auth/modules/users/use-cases/create-user/create-user.service';
import { SignUpDto } from '../sign-up/dtos/sign-up.dto';
import { CreateUserModule } from '@apps/auth/modules/users/use-cases/create-user/create-user.module';
import { SignInDto } from './dtos/sign-in.dto';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from '@apps/auth/modules/configs/config-module.config';
import { typeOrmModuleOptions } from '@apps/auth/modules/configs/typeorm-config.config';
import { InvalidCredentialsError } from './errors/invalid-credentials.error';
import { AuthToken } from './sign-in.type';

describe(SignInController.name, () => {
  const method = 'execute';
  const factory = new UsersFactory();
  const signUpDto: SignUpDto = factory
    .pick(['email', 'password', 'firstName', 'lastName'])
    .makeOne();
  const signInDto: SignInDto = {
    email: signUpDto.email,
    password: signUpDto.password,
  };
  let controller: SignInController;
  let repository: Repository<User>;

  beforeAll(async () => {
    const modules = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(configModuleOptions),
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),

        SignInModule,
        CreateUserModule,
      ],
    }).compile();

    controller = modules.get(SignInController);
    repository = modules.get(getRepositoryToken(User));
    const createUserService = modules.get(CreateUserService);

    await repository.clear();
    await createUserService.create(signUpDto);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe(method, () => {
    it('should be defined', () => {
      expect(controller[method]).toBeDefined();
    });

    it('should login with correct credentials', async () => {
      const spy = jest.spyOn(controller, method);
      const result = await controller.execute(signInDto);

      expect(spy).toHaveBeenCalledTimes(1);
      (['header', 'type', 'token'] as (keyof AuthToken)[]).forEach((prop) => {
        expect(result).toHaveProperty(prop);
      });
    });

    it('should throw error when user does not exist', async () => {
      const signInDtoToThrow = {
        ...signInDto,
        email: signInDto.email + 'some',
      };
      const spy = jest.spyOn(controller, method);

      expect(controller.execute(signInDtoToThrow)).rejects.toThrow(
        InvalidCredentialsError,
      );
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it("should throw error when credentials don't match", async () => {
      const signInDtoToThrow = {
        ...signInDto,
        password: signInDto.password + '.',
      } satisfies SignInDto;
      const spy = jest.spyOn(controller, method);

      expect(controller.execute(signInDtoToThrow)).rejects.toThrow();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
