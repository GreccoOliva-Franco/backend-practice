import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { PrismaClient, User } from '@prisma/client';
import { VerifyEmailDto } from './dtos/verify-email.dto';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as dayjsUtcPlugin from 'dayjs/plugin/utc';
import { InvalidTokenPayloadError } from './errors/invalid-token-payload.error';
import { UserNotFoundError } from './errors/user-not-found.error';
import { UserAlreadyVerifiedError } from './errors/user-already-verified.error';

dayjs.extend(dayjsUtcPlugin);

@Injectable()
export class VerifyEmailService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaClient,
  ) {}

  async verify({ token }: VerifyEmailDto): Promise<void> {
    try {
      const payload = await this.jwtService.verifyAsync<{
        user: User['id'];
      }>(token);

      await this.verifyUser(payload.user);
    } catch (error: unknown) {
      const caughtErrors = [
        JsonWebTokenError,
        InvalidTokenPayloadError,
        UserNotFoundError,
      ];
      const isKnownError = caughtErrors.some(
        (errorClass) => error instanceof errorClass,
      );
      if (isKnownError) {
        throw new UnauthorizedException();
      }

      throw new InternalServerErrorException();
    }
  }

  async verifyUser(userId: User['id']): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      omit: { password: true },
    });
    if (!user) {
      throw new UserNotFoundError();
    }
    if (user.emailVerifiedAt) {
      throw new UserAlreadyVerifiedError();
    }

    const now = dayjs.utc().toISOString();
    await this.prisma.user.update({
      where: { id: user.id },
      data: { emailVerifiedAt: now, updatedAt: now },
    });
  }
}
