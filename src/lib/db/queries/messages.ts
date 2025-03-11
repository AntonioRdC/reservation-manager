'use server';

import { db } from '@/lib/db/drizzle';
import { messages } from '@/lib/db/schema';

export const createMessage = async (
  content: string,
  senderId: string,
  conversationId: string,
) => {
  try {
    const [newMessage] = await db
      .insert(messages)
      .values({
        content,
        senderId,
        conversationId,
      })
      .returning();

    return newMessage;
  } catch (error) {
    return null;
  }
};
