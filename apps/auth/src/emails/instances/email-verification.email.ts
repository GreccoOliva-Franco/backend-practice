import { PrismaClient } from '@prisma/client';
import { EmailDto } from '../email.type';
import { EmailBuilder } from './email-builder.class';
import { JwtService } from '@nestjs/jwt';
import Mustache from 'mustache';

export class EmailVerificationEmail extends EmailBuilder {
  constructor(
    emailDto: EmailDto,
    private readonly prisma: PrismaClient,
    private readonly jwtService: JwtService,
  ) {
    super(emailDto);
  }

  protected async setup(): Promise<void> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: this.context.userId },
      omit: { password: true },
    });

    const token = await this.jwtService.signAsync({ user: user.id });

    const template = await this.getTemplate();
    const templateContext = { user, token };
    const html = Mustache.render(template, templateContext);

    this.setContext({ target: user.email, html });
  }
}
