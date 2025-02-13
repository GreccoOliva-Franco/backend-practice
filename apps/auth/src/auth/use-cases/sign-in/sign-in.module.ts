import { Module } from '@nestjs/common';
import { SignInController } from './sign-in.controller';
import { SignInService } from './sign-in.service';
import { GetUserModule } from '@apps/auth/users/use-cases/get-user/get-user.module';
import { HashModule } from '@lib/hash/hash.module';

@Module({
  imports: [HashModule, GetUserModule],
  controllers: [SignInController],
  providers: [SignInService],
})
export class SignInModule {}
