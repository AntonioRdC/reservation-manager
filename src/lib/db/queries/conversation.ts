'use server';

import { db } from '@/lib/db/drizzle';
import { conversations } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const getConversationByReservationId = async (reservationId: string) => {
  try {
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.bookingId, reservationId));
    return conversation;
  } catch (error) {
    return null;
  }
};

export const createConversation = async (reservationId: string) => {
  try {
    const [conversation] = await db
      .insert(conversations)
      .values({ bookingId: reservationId })
      .returning();
    return conversation;
  } catch (error) {
    return null;
  }
};
