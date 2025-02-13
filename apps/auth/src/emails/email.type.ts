import { User } from '@prisma/client';

export enum EmailId {
  WELCOME_EMAIL = 'welcome.email',
  VERIFICATION_EMAIL = 'email-verification.email',
}

export type EmailDto = {
  emailId: EmailId;
  userId: User['id'];
};
