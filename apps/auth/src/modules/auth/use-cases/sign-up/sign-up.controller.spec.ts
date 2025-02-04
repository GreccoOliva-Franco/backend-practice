/**
 * @group app.auth
 * @group ms.auth
 * @group module.auth
 * @group integration
 */

import { Test } from '@nestjs/testing';
import { SignUpController } from './sign-up.controller';
import { SignUpModule } from './sign-up.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from '@apps/auth/modules/configs/typeorm-config.config';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from '@apps/auth/modules/configs/config-module.config';

describe(SignUpController.name, () => {
  const method = 'execute';
  let controller: SignUpController;

  beforeEach(async () => {
    const modules = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(configModuleOptions),
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
        SignUpModule,
      ],
    }).compile();

    controller = modules.get(SignUpController);
  });

  describe(method, () => {
    it('should be defined', () => {
      expect(controller[method]).toBeDefined();
    });
  });
});
