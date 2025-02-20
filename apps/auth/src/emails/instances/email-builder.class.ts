import { EmailDto, EmailId } from '../email.type';
import * as path from 'path';
import * as fs from 'fs';
import * as Handlebars from 'handlebars';

export abstract class EmailBuilder {
  protected emailId: EmailId;
  private html: string;
  protected context: Omit<EmailDto, 'emailId'>;

  /**
   * Execute everything needed to provide the context for the email.
   * @returns void
   */
  protected abstract setup(): Promise<void>;
  protected abstract getFrom(): string;
  protected abstract getTo(): string;
  protected abstract getSubject(): string;
  protected abstract getTemplateContext(): any;

  constructor({ emailId, ...context }: EmailDto) {
    this.emailId = emailId;
    this.context = context;
  }

  public async build(): Promise<this> {
    await this.setup();
    await this._build();

    return this;
  }

  public getTransporterFields() {
    return {
      from: this.getFrom(),
      to: this.getTo(),
      subject: this.getSubject(),
      html: this.getHtml(),
    };
  }

  protected async getTemplate() {
    const template = await fs.promises.readFile(
      this.getTemplatePath(),
      'utf-8',
    );

    return Handlebars.compile(template);
  }

  private async _build(): Promise<void> {
    const template = await this.getTemplate();
    const templateContext = this.getTemplateContext();
    this.html = template(templateContext);
  }

  private getTemplatePath(): string {
    return path.join(
      process.cwd(),
      './apps/auth/src/emails/templates/',
      this.emailId + '.hbs',
    );
  }

  private getHtml(): string {
    return this.html;
  }
}
