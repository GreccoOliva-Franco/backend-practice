import { Module } from '@nestjs/common';
import { SignInController } from './sign-in.controller';
import { SignInService } from './sign-in.service';
import { GetUserModule } from '@apps/auth/modules/users/use-cases/get-user/get-user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtModuleAsyncOptions } from './constants/jwt.constants';
import { HashModule } from '@lib/hash/hash.module';

@Module({
  imports: [
    HashModule,
    JwtModule.registerAsync(jwtModuleAsyncOptions),

    GetUserModule,
  ],
  controllers: [SignInController],
  providers: [SignInService],
})
export class SignInModule {}
