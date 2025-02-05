import { Module } from '@nestjs/common';
import { SignUpModule } from './use-cases/sign-up/sign-up.module';
import { SignInModule } from './use-cases/sign-in/sign-in.module';

@Module({
  imports: [SignUpModule, SignInModule],
})
export class AuthModule {}
