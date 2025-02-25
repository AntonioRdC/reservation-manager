'use server';

import { getBookingById } from '@/lib/db/queries/bookings';
import { getResourceBookingByUserId } from '@/lib/db/queries/resource-booking';
import { getAllResources } from '@/lib/db/queries/resources';
import { getAllSpaces } from '@/lib/db/queries/spaces';
import { Booking, Resource, Space } from '@/lib/db/schema';

export interface UserBookings extends Booking {
  space: Space;
  resources?: Resource[];
}

export async function getUserBooking(
  bookingId: string,
): Promise<UserBookings | null> {
  const booking = await getBookingById(bookingId);
  const allSpaces = await getAllSpaces();
  if (!booking || !allSpaces) {
    return null;
  }

  const allResources = await getAllResources();
  if (!allResources) {
    const space = allSpaces.find((s) => s.id === booking.spaceId)!;

    return {
      ...booking,
      space,
    };
  }

  const allResourceBookings = await getResourceBookingByUserId(booking.id);
  if (!allResourceBookings) {
    const space = allSpaces.find((s) => s.id === booking.spaceId)!;

    return {
      ...booking,
      space,
    };
  }

  const resources = allResourceBookings.map((rb) => {
    const resource = allResources.find((r) => r.id === rb.resourceId);
    return {
      ...resource!,
      quantity: rb.quantity,
    };
  });

  const space = allSpaces.find((s) => s.id === booking.spaceId)!;

  return {
    ...booking,
    space,
    resources,
  };
}
