import { eq, sql } from 'drizzle-orm';

import { users } from '@/lib/db/schema';
import { db } from '@/lib/db/drizzle';

export const getUserByEmail = async (email: string) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.email, email));

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, id));

    return user;
  } catch {
    return null;
  }
};

export const createUser = async (
  name: string,
  email: string,
  hashedPassword: string,
) => {
  try {
    const [newUser] = await db
      .insert(users)
      .values({ name, email, password: hashedPassword })
      .returning();

    return newUser;
  } catch {
    return null;
  }
};

export const updateEmailVerifiedUser = async (id: string, email: string) => {
  try {
    const [updatedUser] = await db
      .update(users)
      .set({ emailVerified: new Date(), email, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    return updatedUser;
  } catch {
    return null;
  }
};

export const updatePasswordUser = async (id: string, password: string) => {
  try {
    const [updatedUser] = await db
      .update(users)
      .set({ password, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    return updatedUser;
  } catch {
    return null;
  }
};

export const updateAccountUser = async (
  id: string,
  name: string,
  email: string | undefined,
  emailVerified: null | undefined,
) => {
  try {
    const [updatedUser] = await db
      .update(users)
      .set({ name, email, emailVerified, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    return updatedUser;
  } catch {
    return null;
  }
};

export const deleteUserById = async (id: string) => {
  try {
    const [deletedUser] = await db
      .update(users)
      .set({
        deletedAt: new Date(),
        email: sql`CONCAT(email, '-', id, '-deleted')`,
      })
      .where(eq(users.id, id))
      .returning();

    return deletedUser;
  } catch {
    return null;
  }
};
