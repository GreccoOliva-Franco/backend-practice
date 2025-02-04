/**
 * @group app.auth
 * @group ms.auth
 * @group module.auth
 * @group integration
 */

import { Test } from '@nestjs/testing';
import { SignUpController } from './sign-up.controller';
import { SignUpModule } from './sign-up.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from '@apps/auth/modules/configs/typeorm-config.config';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from '@apps/auth/modules/configs/config-module.config';
import { SignUpDto } from './dtos/sign-up.dto';
import { UsersFactory } from '@apps/auth/modules/users/factories/users.factory';
import { User } from '@apps/auth/modules/users/entities/users.entity';
import { Repository } from 'typeorm';
import { UserAlreadyExistsError } from './errors/user-already-exists.error';

describe(SignUpController.name, () => {
  const method = 'execute';
  const factory = new UsersFactory();
  const signUpDtoFields: (keyof SignUpDto)[] = [
    'email',
    'password',
    'firstName',
    'lastName',
  ];
  let controller: SignUpController;
  let repository: Repository<User>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const modules = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(configModuleOptions),
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),

        SignUpModule,
      ],
    }).compile();

    controller = modules.get(SignUpController);
    repository = modules.get(getRepositoryToken(User));

    await repository.clear();
  });

  describe(method, () => {
    it('should be defined', () => {
      expect(controller[method]).toBeDefined();
    });

    it('should create a user', async () => {
      const signUpDto: SignUpDto = factory.pick(signUpDtoFields).makeOne();
      const spy = jest.spyOn(controller, 'execute');

      const result = await controller.execute(signUpDto);
      const userInDatabase = await repository.findOneBy({
        email: signUpDto.email,
      });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
      expect(userInDatabase).toBeDefined();
    });

    it('should throw when user already exists', async () => {
      const signUpDto: SignUpDto = factory.pick(signUpDtoFields).makeOne();
      const spy = jest.spyOn(controller, 'execute');

      await controller.execute(signUpDto);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(controller.execute(signUpDto)).rejects.toThrow(
        UserAlreadyExistsError,
      );
      expect(spy).toHaveBeenCalledTimes(2);
    });
  });
});
