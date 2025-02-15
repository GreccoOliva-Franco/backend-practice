import { Module } from '@nestjs/common';
import { SignUpModule } from './use-cases/sign-up/sign-up.module';
import { VerifyEmailModule } from './use-cases/verify-email/verify-email.module';
// import { SignInModule } from './use-cases/sign-in/sign-in.module';
// import { GetProfileModule } from './use-cases/get-profile/get-profile.module';

@Module({
  imports: [
    SignUpModule,
    VerifyEmailModule,
    // SignInModule,
    // GetProfileModule
  ],
})
export class AuthModule {}
