'use server';

import { db } from '@/lib/db/drizzle';
import { eq } from 'drizzle-orm';
import { conversationParticipants, users } from '@/lib/db/schema';

export const createConversationParticipants = async (
  conversationId: string,
  userId: string,
) => {
  try {
    const [participant] = await db
      .insert(conversationParticipants)
      .values({
        conversationId,
        userId,
      })
      .returning();
    const admins = await db.select().from(users).where(eq(users.role, 'admin'));

    const adminRows = admins
      .filter((admin) => admin.id !== userId)
      .map((admin) => ({
        conversationId,
        userId: admin.id,
      }));

    if (adminRows.length) {
      await db.insert(conversationParticipants).values(adminRows);
    }

    return participant;
  } catch (error) {
    return null;
  }
};
