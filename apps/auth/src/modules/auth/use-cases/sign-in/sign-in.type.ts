import { User } from '@apps/auth/modules/users/entities/users.entity';

export type AuthToken = {
  header: 'Authorization';
  value: string;
};

export type AuthTokenPayload = {
  sub: User['id'];
};
