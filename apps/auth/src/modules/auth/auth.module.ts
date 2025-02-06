import { Module } from '@nestjs/common';
import { SignUpModule } from './use-cases/sign-up/sign-up.module';
import { SignInModule } from './use-cases/sign-in/sign-in.module';
import { GetProfileModule } from './use-cases/get-profile/get-profile.module';

@Module({
  imports: [SignUpModule, SignInModule, GetProfileModule],
})
export class AuthModule {}
