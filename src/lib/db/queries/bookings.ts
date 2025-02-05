import { asc, eq } from 'drizzle-orm';

import { Booking, bookings, NewBooking } from '@/lib/db/schema';
import { db } from '@/lib/db/drizzle';

export const getAllBookings = async () => {
  try {
    const bookingsList = await db
      .select()
      .from(bookings)
      .orderBy(asc(bookings.createdAt));

    return bookingsList;
  } catch (error) {
    return null;
  }
};

export const getBookingsById = async (userId: string): Promise<Booking[]> => {
  try {
    const bookingsList = await db
      .select()
      .from(bookings)
      .where(eq(bookings.userId, userId))
      .orderBy(asc(bookings.createdAt));

    return bookingsList;
  } catch (error) {
    return null;
  }
};

export const updateStatusBooking = async (id: string, status: string) => {
  try {
    const [updatedBooking] = await db
      .update(bookings)
      .set({ status })
      .where(eq(bookings.id, id))
      .returning();

    return updatedBooking;
  } catch (error) {
    return null;
  }
};

export const createBooking = async (payload: NewBooking) => {
  try {
    const [newBooking] = await db
      .insert(bookings)
      .values({ ...payload, status: 'REQUESTED' })
      .returning();

    return newBooking;
  } catch (error) {
    return null;
  }
};
