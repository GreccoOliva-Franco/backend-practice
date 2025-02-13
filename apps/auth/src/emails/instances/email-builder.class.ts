import { User } from '@prisma/client';
import { EmailDto, EmailId } from '../email.type';
import * as path from 'path';
import * as fs from 'fs';

type Context = { target: User['email']; html: string };

export abstract class EmailBuilder {
  protected emailId: EmailId;
  protected context: Omit<EmailDto, 'emailId'>;
  protected target: string;
  protected html: string;

  protected abstract setup(): Promise<void>;

  constructor({ emailId, ...context }: EmailDto) {
    this.emailId = emailId;
    this.context = context;
  }

  public getNodemailerFields(): object {
    return {
      to: this.getTarget(),
      html: this.getContent(),
    };
  }

  protected getTemplatePath(): string {
    return path.join(
      process.cwd(),
      './apps/auth/src/emails/templates/',
      this.emailId + '.html',
    );
  }

  protected getTemplate(): Promise<string> {
    return fs.promises.readFile(this.getTemplatePath(), 'utf-8');
  }

  protected async setContext({ target, html }: Context) {
    this.target = target;
    this.html = html;
  }

  private getContent(): string {
    return this.html;
  }

  private getTarget(): string {
    return this.target;
  }
}
