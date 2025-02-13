import { User } from '@prisma/client';

export type UserCredentials = Pick<User, 'id' | 'email' | 'password'>;
export type UserProfile = Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>;
