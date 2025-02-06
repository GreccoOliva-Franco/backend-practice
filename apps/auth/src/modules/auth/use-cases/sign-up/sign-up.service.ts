import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserService } from '@apps/auth/modules/users/use-cases/create-user/create-user.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { UserAlreadyExistsError as UserAlreadyExistsUsersError } from '@apps/auth/modules/users/use-cases/create-user/errors/user-already-exists.error';
import { UserAlreadyExistsError } from './errors/user-already-exists.error';

@Injectable()
export class SignUpService {
  constructor(private readonly createUserService: CreateUserService) {}

  async execute(signUpDto: SignUpDto): Promise<void> {
    try {
      await this.createUserService.create(signUpDto);
    } catch (error) {
      if (error instanceof UserAlreadyExistsUsersError) {
        throw new UserAlreadyExistsError();
      }

      throw new InternalServerErrorException();
    }
  }
}
