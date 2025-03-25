import NextAuth, { type DefaultSession } from 'next-auth';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export type ExtendedUser = DefaultSession['user'] & {
  role: UserRole;
  isOAuth: boolean;
};

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser;
  }
}
