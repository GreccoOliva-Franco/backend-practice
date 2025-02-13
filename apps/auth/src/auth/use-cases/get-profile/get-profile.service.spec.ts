import { Test } from '@nestjs/testing';
import { GetProfileModule } from './get-profile.module';
import { CreateUserService } from '@apps/auth/users/use-cases/create-user/create-user.service';
import { UsersFactory } from '@apps/auth/users/factories/users.factory';
import { User } from '@apps/auth/users/entities/users.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserDto } from '@apps/auth/users/use-cases/create-user/dtos/create-user.dto';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from '@apps/auth/configs/config-module.config';
import { typeOrmModuleOptions } from '@apps/auth/configs/typeorm-config.config';
import { CreateUserModule } from '@apps/auth/users/use-cases/create-user/create-user.module';
import { UserDoesNotExistError } from './errors/user-does-not-exist.error';
import { GetProfileService } from './get-profile.service';

describe(GetProfileService.name, () => {
  const method = 'execute';
  const factory = new UsersFactory();
  const createUserDto: CreateUserDto = factory
    .pick(['email', 'password', 'firstName', 'lastName'])
    .makeOne();
  let service: GetProfileService;
  let userInDatabase: User;

  beforeAll(async () => {
    const modules = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(configModuleOptions),
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),

        CreateUserModule,
        GetProfileModule,
      ],
    }).compile();

    service = modules.get(GetProfileService);
    const createUserService = modules.get(CreateUserService);
    const userRepository = modules.get(getRepositoryToken(User));

    await createUserService.create(createUserDto);

    userInDatabase = await userRepository.findOneBy({
      email: createUserDto.email,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe(method, () => {
    it('should be defined', () => {
      expect(service[method]).toBeDefined();
    });

    it("should retrieve the target user's profile", async () => {
      const spy = jest.spyOn(service, method);
      const { id, email, firstName, lastName } = userInDatabase;
      const result = await service[method](id);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(result).toMatchObject({ id, email, firstName, lastName });
    });

    it('should throw error if user does not exist', async () => {
      const spy = jest.spyOn(service, method);
      const idNotInDatabase = userInDatabase.id + 1;

      await expect(service[method](idNotInDatabase)).rejects.toThrow(
        UserDoesNotExistError,
      );
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
