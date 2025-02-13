import { EmailBuilder } from './email-builder.class';
import { EmailDto } from '../email.type';
import { PrismaClient, User } from '@prisma/client';
import { EMAIL_DEFAULT_FROM } from '../email.constants';

export class WelcomeEmail extends EmailBuilder {
  private user: Omit<User, 'password'>;

  constructor(
    emailDto: EmailDto,
    private readonly prisma: PrismaClient,
  ) {
    super(emailDto);
  }

  protected async setup(): Promise<void> {
    this.user = await this.prisma.user.findUniqueOrThrow({
      where: { id: this.context.userId },
      omit: { password: true },
    });
  }
  protected getFrom(): string {
    return EMAIL_DEFAULT_FROM;
  }
  protected getTo(): string {
    return this.user.email;
  }
  protected getSubject(): string {
    return 'Welcome to <my-app> please enjoy the ride with us';
  }
  protected async getTemplateContext() {
    return { user: this.user };
  }
}
