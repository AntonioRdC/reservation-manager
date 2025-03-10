'use server';

import { eq } from 'drizzle-orm';

import { db } from '@/lib/db/drizzle';
import { accounts } from '@/lib/db/schema';

export const getAccountByUserId = async (id: string) => {
  try {
    const [account] = await db
      .select()
      .from(accounts)
      .where(eq(accounts.userId, id));

    return account;
  } catch {
    return null;
  }
};

export const deleteAccountByUserId = async (id: string) => {
  try {
    const deletedAccount = await db
      .delete(accounts)
      .where(eq(accounts.userId, id))
      .returning();

    return deletedAccount;
  } catch {
    return null;
  }
};
