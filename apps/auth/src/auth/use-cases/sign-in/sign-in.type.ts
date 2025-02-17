import { User } from '@prisma/client';

export type AuthToken = {
  header: 'Authorization';
  value: string;
};

export type AuthTokenPayload = {
  user: User['id'];
};
