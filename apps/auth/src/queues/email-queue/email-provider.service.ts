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
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT', { infer: true }),
    });
  }

  public async send(emailDto: EmailDto): Promise<void> {
    const email = await this.getEmailByDto(emailDto);

    await this.transporter.sendMail({
      from: 'test@test.com',
      ...email.getNodemailerFields(),
    });
  }

  private async getEmailByDto(emailDto: EmailDto): Promise<EmailBuilder> {
    switch (emailDto.emailId) {
      case EmailId.WELCOME_EMAIL: {
        return new WelcomeEmail(emailDto, this.prisma);
      }
      case EmailId.VERIFICATION_EMAIL: {
        return new EmailVerificationEmail(
          emailDto,
          this.prisma,
          this.jwtService,
        );
      }
      default: {
        throw new Error(
          `Email instance for (${emailDto.emailId}) does not exist`,
        );
      }
    }
  }
}
