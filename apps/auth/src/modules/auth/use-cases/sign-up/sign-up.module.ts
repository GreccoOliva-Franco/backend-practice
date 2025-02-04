import { Module } from '@nestjs/common';
import { CreateUserModule } from '@apps/auth/modules/users/use-cases/create-user/create-user.module';
import { SignUpController } from './sign-up.controller';
import { SignUpService } from './sign-up.service';

@Module({
  imports: [CreateUserModule],
  controllers: [SignUpController],
  providers: [SignUpService],
})
export class SignUpModule {}
