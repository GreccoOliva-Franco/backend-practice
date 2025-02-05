import { GetUserService } from '@apps/auth/modules/users/use-cases/get-user/get-user.service';
import { Injectable } from '@nestjs/common';
import { SignInDto } from './dtos/sign-in.dto';
import { InvalidCredentialsError } from './errors/invalid-credentials.error';
import { UserCredentials } from '@apps/auth/modules/users/use-cases/get-user/get-user.types';
import { HashService } from '@lib/hash/hash.service';
import { AuthToken } from './sign-in.type';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SignInService {
  constructor(
    private readonly getUserService: GetUserService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(signInDto: SignInDto): Promise<AuthToken> {
    const user = await this.getUserByEmailOrThrowError(signInDto.email);

    await this.validateCredentialsOrThrow(signInDto, user);

    return this.getAuthToken(user);
  }

  private async getUserByEmailOrThrowError(
    email: SignInDto['email'],
  ): Promise<UserCredentials> {
    const user = await this.getUserService.getCredentialsByEmail(email);
    if (!user) {
      throw new InvalidCredentialsError();
    }
    return user;
  }

  private async validateCredentialsOrThrow(
    signInDto: SignInDto,
    user: UserCredentials,
  ): Promise<void> {
    const isValidPassword = await this.hashService.compare(
      signInDto.password,
      user.password,
    );
    if (!isValidPassword) {
      throw new InvalidCredentialsError();
    }
  }

  private async getAuthToken(user: UserCredentials): Promise<AuthToken> {
    const tokenPayload = { id: user.id };
    const token = await this.jwtService.signAsync(tokenPayload);

    return {
      header: 'Authorization',
      type: 'Bearer',
      token,
    } satisfies AuthToken;
  }
}
