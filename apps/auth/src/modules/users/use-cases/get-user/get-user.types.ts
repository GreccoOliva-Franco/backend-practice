import { User } from '@apps/auth/modules/users/entities/users.entity';

export type UserCredentials = Pick<User, 'id' | 'email' | 'password'>;
