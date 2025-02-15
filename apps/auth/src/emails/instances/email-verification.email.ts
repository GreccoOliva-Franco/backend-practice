import { PrismaClient, User } from '@prisma/client';
import { EmailDto } from '../email.type';
import { EmailBuilder } from './email-builder.class';
import { JwtService } from '@nestjs/jwt';
import { EMAIL_DEFAULT_FROM } from '../email.constants';

export class EmailVerificationEmail extends EmailBuilder {
  private user: Omit<User, 'password'>;
  private token: string;

  constructor(
    emailDto: EmailDto,
    private readonly prisma: PrismaClient,
    private readonly jwtService: JwtService,
  ) {
    super(emailDto);
  }

  protected async setup(): Promise<void> {
    this.user = await this.prisma.user.findUniqueOrThrow({
      where: { id: this.context.userId },
      omit: { password: true },
    });
    this.token = await this.jwtService.signAsync({ user: this.user.id });
  }
  protected getFrom(): string {
    return EMAIL_DEFAULT_FROM;
  }
  protected getTo(): string {
    return this.user.email;
  }
  protected getSubject(): string {
    return '<my-app>: Email verification required';
  }
  protected getTemplateContext() {
    const { user, token } = this;
    return { user, token };
  }
}
