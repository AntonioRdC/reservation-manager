'use server';

import { eq } from 'drizzle-orm';

import { passwordResetTokens } from '@/lib/db/schema';
import { db } from '@/lib/db/drizzle';

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const [passwordResetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token));

    return passwordResetToken;
  } catch (error) {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const [passwordResetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.email, email));

    return passwordResetToken;
  } catch (error) {
    return null;
  }
};

export const deletePasswordResetToken = async (id: string) => {
  try {
    const deletedToken = await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.id, id))
      .returning();

    return deletedToken;
  } catch {
    return null;
  }
};

export const createPasswordResetToken = async (
  email: string,
  token: string,
  expires: Date,
) => {
  try {
    const [newPasswordResetToken] = await db
      .insert(passwordResetTokens)
      .values({ email, token, expires })
      .returning();

    return newPasswordResetToken;
  } catch {
    return null;
  }
};
