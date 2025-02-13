import { Module } from '@nestjs/common';
import { CreateUserModule } from '@apps/auth/users/use-cases/create-user/create-user.module';
import { SignUpController } from './sign-up.controller';
import { SignUpService } from './sign-up.service';
import { EmailModule } from '@apps/auth/emails/email.module';

@Module({
  imports: [CreateUserModule, EmailModule],
  controllers: [SignUpController],
  providers: [SignUpService],
})
export class SignUpModule {}
