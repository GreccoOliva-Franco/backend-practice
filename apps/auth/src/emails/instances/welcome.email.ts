import { EmailBuilder } from './email-builder.class';
import * as Mustache from 'mustache';
import { Injectable } from '@nestjs/common';
import { EmailDto } from '../email.type';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class WelcomeEmail extends EmailBuilder {
  constructor(
    emailDto: EmailDto,
    private readonly prisma: PrismaClient,
  ) {
    super(emailDto);
  }
  protected async setup(): Promise<void> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: this.context.userId },
      omit: { password: true },
    });

    const template = await this.getTemplate();
    const templateContext = { user };
    const html = Mustache.render(template, templateContext);

    this.setContext({ target: user.email, html });
  }
}
