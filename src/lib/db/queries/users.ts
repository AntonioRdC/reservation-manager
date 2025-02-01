import { eq } from 'drizzle-orm';

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
      .set({ emailVerified: new Date(), email })
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
      .set({ password })
      .where(eq(users.id, id))
      .returning();

    return updatedUser;
  } catch {
    return null;
  }
};

export const updateNameAndEmailUser = async (
  id: string,
  name: string,
  email: string,
) => {
  try {
    const [updatedUser] = await db
      .update(users)
      .set({ name, email })
      .where(eq(users.id, id))
      .returning();

    return updatedUser;
  } catch {
    return null;
  }
};
