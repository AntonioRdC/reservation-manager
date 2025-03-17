'use server';

import { db } from '@/lib/db/drizzle';
import { eq } from 'drizzle-orm';
import { conversationParticipants, users } from '@/lib/db/schema';

export type ChatParticipant = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
  joinedAt: Date | null;
};

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

    const admins = await db.select().from(users).where(eq(users.role, 'ADMIN'));

    const adminRows = admins
      .filter((admin) => admin.id !== userId)
      .map((admin) => ({
        conversationId,
        userId: admin.id,
      }));

    if (adminRows.length) {
      await db.insert(conversationParticipants).values(adminRows);
    }

    const allParticipants = await getConversationParticipants(conversationId);

    return allParticipants;
  } catch (error) {
    return null;
  }
};

export const getConversationParticipants = async (
  conversationId: string,
): Promise<ChatParticipant[] | null> => {
  try {
    const participants = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
        role: users.role,
        joinedAt: conversationParticipants.joinedAt,
      })
      .from(conversationParticipants)
      .innerJoin(users, eq(conversationParticipants.userId, users.id))
      .where(eq(conversationParticipants.conversationId, conversationId));

    return participants;
  } catch (error) {
    return null;
  }
};
