import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserService } from '@apps/auth/users/use-cases/create-user/create-user.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { UserAlreadyExistsError as UserAlreadyExistsUsersError } from '@apps/auth/users/use-cases/create-user/errors/user-already-exists.error';
import { UserAlreadyExistsError } from './errors/user-already-exists.error';
import { CreatedUser } from '@apps/auth/users/use-cases/create-user/create-user.types';
import { EmailDto, EmailId } from '@apps/auth/emails/email.type';
import { EmailService } from '@apps/auth/emails/email.service';

@Injectable()
export class SignUpService {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly emailService: EmailService,
  ) {}

  async execute(signUpDto: SignUpDto): Promise<void> {
    try {
      const user = await this.createUserService.create(signUpDto);

      this.sendEmailsToUser(user);
    } catch (error) {
      if (error instanceof UserAlreadyExistsUsersError) {
        throw new UserAlreadyExistsError();
      }

      throw new InternalServerErrorException();
    }
  }

  private async sendEmailsToUser(user: CreatedUser): Promise<void> {
    const emailDtos: EmailDto[] = [
      EmailId.WELCOME_EMAIL,
      // EmailId.VERIFICATION_EMAIL,
    ].map((emailId) => ({ emailId, userId: user.id }) satisfies EmailDto);

    await this.emailService.sendMany(emailDtos);
  }
}
