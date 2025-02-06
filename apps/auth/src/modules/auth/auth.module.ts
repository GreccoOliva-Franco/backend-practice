import { Module } from '@nestjs/common';
import { SignUpModule } from './use-cases/sign-up/sign-up.module';
import { SignInModule } from './use-cases/sign-in/sign-in.module';
import { GetProfileModule } from './use-cases/get-profile/get-profile.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [SignUpModule, SignInModule, GetProfileModule],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }],
})
export class AuthModule {}
