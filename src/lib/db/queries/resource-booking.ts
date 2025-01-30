import { NewResourceBooking, resourceBookings } from '@/lib/db/schema';
import { db } from '@/lib/db/drizzle';

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
