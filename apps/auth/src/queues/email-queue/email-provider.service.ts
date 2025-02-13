import { EmailDto, EmailId } from '@apps/auth/emails/email.type';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { WelcomeEmail } from '@apps/auth/emails/instances/welcome.email';
import { EmailBuilder } from '@apps/auth/emails/instances/email-builder.class';
import { EmailVerificationEmail } from '@apps/auth/emails/instances/email-verification.email';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class EmailProviderService {
  private readonly transporter: nodemailer.Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  >;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaClient,
    private readonly jwtService: JwtService,
  ) {
    const host = this.configService.get<string>('EMAIL_HOST');
    const port = this.configService.get<number>('EMAIL_PORT', { infer: true });
    this.transporter = nodemailer.createTransport({ host, port });
  }

  public async send(emailDto: EmailDto): Promise<void> {
    const email = await this.getEmailByDto(emailDto);

    await this.transporter.sendMail(email.getTransporterFields());
  }

  private async getEmailByDto(emailDto: EmailDto): Promise<EmailBuilder> {
    let instance: EmailBuilder;

    switch (emailDto.emailId) {
      case EmailId.WELCOME_EMAIL: {
        instance = new WelcomeEmail(emailDto, this.prisma);
        break;
      }
      case EmailId.VERIFICATION_EMAIL: {
        instance = new EmailVerificationEmail(
          emailDto,
          this.prisma,
          this.jwtService,
        );
        break;
      }
      default: {
        throw new Error(
          `Email instance for (${emailDto.emailId}) does not exist`,
        );
      }
    }

    await instance.build();

    return instance;
  }
}
