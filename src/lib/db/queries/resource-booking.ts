'use server';

import { NewResourceBooking, resourceBookings } from '@/lib/db/schema';
import { db } from '@/lib/db/drizzle';
import { eq } from 'drizzle-orm';

export const createResourceBooking = async (payload: NewResourceBooking) => {
  try {
    const [resourceBooking] = await db
      .insert(resourceBookings)
      .values(payload)
      .returning();

    return resourceBooking;
  } catch {
    return null;
  }
};

export const getResourceBookingByUserId = async (bookingId: string) => {
  try {
    const resourcesList = await db
      .select()
      .from(resourceBookings)
      .where(eq(resourceBookings.bookingId, bookingId));

    return resourcesList;
  } catch {
    return null;
  }
};

export const getResourceBookingsByResourceId = async (resourceId: string) => {
  try {
    const bookings = await db
      .select()
      .from(resourceBookings)
      .where(eq(resourceBookings.resourceId, resourceId));

    return bookings;
  } catch {
    return null;
  }
};
