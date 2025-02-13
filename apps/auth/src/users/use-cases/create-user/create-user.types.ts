import { User } from '@prisma/client';

export type CreatedUser = Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>;
