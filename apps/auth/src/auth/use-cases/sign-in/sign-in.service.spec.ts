/**
 * @group app.auth
 * @group ms.auth
 * @group module.auth
 * @group integration
 */

import { UsersFactory } from '@apps/auth/users/factories/users.factory';
import { Test } from '@nestjs/testing';
import { SignInModule } from './sign-in.module';
import { CreateUserService } from '@apps/auth/users/use-cases/create-user/create-user.service';
import { SignUpDto } from '@apps/auth/auth/use-cases/sign-up/dtos/sign-up.dto';
import { CreateUserModule } from '@apps/auth/users/use-cases/create-user/create-user.module';
import { SignInDto } from './dtos/sign-in.dto';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from '@apps/auth/configs/config-module.config';
import { InvalidCredentialsError } from './errors/invalid-credentials.error';
import { AuthToken } from './sign-in.type';
import { SignInService } from './sign-in.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtModuleAsyncOptions } from '@apps/auth/configs/jwt-module.config';
import { PrismaClient } from '@prisma/client';

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
  let datasource: PrismaClient;

  beforeAll(async () => {
    const modules = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(configModuleOptions),
        JwtModule.registerAsync(jwtModuleAsyncOptions),

        SignInModule,
        CreateUserModule,
      ],
    }).compile();

    service = modules.get(SignInService);
    datasource = modules.get(PrismaClient);
    const createUserService = modules.get(CreateUserService);

    await datasource.user.deleteMany();
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
