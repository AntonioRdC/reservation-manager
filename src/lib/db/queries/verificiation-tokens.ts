import { eq } from 'drizzle-orm';

import { db } from '@/lib/db/drizzle';
import { verificationTokens } from '@/lib/db/schema';

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const [verificationToken] = await db
      .select()
      .from(verificationTokens)
      .where(eq(verificationTokens.token, token));

    return verificationToken;
  } catch {
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const [verificationToken] = await db
      .select()
      .from(verificationTokens)
      .where(eq(verificationTokens.identifier, email));

    return verificationToken;
  } catch {
    return null;
  }
};

export const deleteVerificationToken = async (email: string) => {
  try {
    const deletedToken = await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.identifier, email))
      .returning();

    return deletedToken;
  } catch {
    return null;
  }
};

export const createVerificationToken = async (
  email: string,
  token: string,
  expires: Date,
) => {
  try {
    const [newVerificationToken] = await db
      .insert(verificationTokens)
      .values({ identifier: email, token, expires })
      .returning();

    return newVerificationToken;
  } catch {
    return null;
  }
};
