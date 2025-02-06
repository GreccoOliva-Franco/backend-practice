/**
 * @group app.auth
 * @group ms.auth
 * @group module.auth
 * @group integration
 */

import { UsersFactory } from '@apps/auth/modules/users/factories/users.factory';
import { Test } from '@nestjs/testing';
import { SignInModule } from './sign-in.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@apps/auth/modules/users/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserService } from '@apps/auth/modules/users/use-cases/create-user/create-user.service';
import { SignUpDto } from '@apps/auth/modules/auth/use-cases/sign-up/dtos/sign-up.dto';
import { CreateUserModule } from '@apps/auth/modules/users/use-cases/create-user/create-user.module';
import { SignInDto } from './dtos/sign-in.dto';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from '@apps/auth/modules/configs/config-module.config';
import { typeOrmModuleOptions } from '@apps/auth/modules/configs/typeorm-config.config';
import { InvalidCredentialsError } from './errors/invalid-credentials.error';
import { AuthToken } from './sign-in.type';
import { SignInService } from './sign-in.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtModuleAsyncOptions } from '@apps/auth/modules/configs/jwt-module.config';

describe(SignInService.name, () => {
  const method = 'execute';
  const factory = new UsersFactory();
  const signUpDto: SignUpDto = factory
    .pick(['email', 'password', 'firstName', 'lastName'])
    .makeOne();
  const signInDto: SignInDto = {
    email: signUpDto.email,
    password: signUpDto.password,
  };
  let service: SignInService;
  let repository: Repository<User>;

  beforeAll(async () => {
    const modules = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(configModuleOptions),
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
        JwtModule.registerAsync(jwtModuleAsyncOptions),

        SignInModule,
        CreateUserModule,
      ],
    }).compile();

    service = modules.get(SignInService);
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
      expect(service[method]).toBeDefined();
    });

    it('should login with correct credentials', async () => {
      const spy = jest.spyOn(service, method);
      const result = await service[method](signInDto);

      expect(spy).toHaveBeenCalledTimes(1);
      (['header', 'value'] as (keyof AuthToken)[]).forEach((prop) => {
        expect(result).toHaveProperty(prop);
      });
    });

    it('should throw error when user does not exist', async () => {
      const signInDtoToThrow = {
        ...signInDto,
        email: signInDto.email + 'some',
      };
      const spy = jest.spyOn(service, method);

      await expect(service[method](signInDtoToThrow)).rejects.toThrow(
        InvalidCredentialsError,
      );
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it("should throw error when credentials don't match", async () => {
      const signInDtoToThrow = {
        ...signInDto,
        password: signInDto.password + '.',
      } satisfies SignInDto;
      const spy = jest.spyOn(service, method);

      await expect(service[method](signInDtoToThrow)).rejects.toThrow(
        InvalidCredentialsError,
      );
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
