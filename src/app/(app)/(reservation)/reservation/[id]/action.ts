'use server';

import { getBookingById } from '@/lib/db/queries/bookings';
import { getResourceBookingByUserId } from '@/lib/db/queries/resource-booking';
import { getAllResources } from '@/lib/db/queries/resources';
import { getAllSpaces } from '@/lib/db/queries/spaces';
import { Booking, Conversation, Resource, Space } from '@/lib/db/schema';
import { getConversationByReservationId } from '@/lib/db/queries/conversation';

export interface UserBookings extends Booking {
  space: Space;
  resources?: Resource[];
  conversation: Conversation;
}

export async function getUserBooking(
  bookingId: string,
): Promise<UserBookings | null> {
  const booking = await getBookingById(bookingId);
  const conversation = await getConversationByReservationId(bookingId);
  const allSpaces = await getAllSpaces();
  console.log(booking, conversation, allSpaces);
  if (!booking || !allSpaces || !conversation) {
    return null;
  }

  const allResources = await getAllResources();
  if (!allResources) {
    const space = allSpaces.find((s) => s.id === booking.spaceId)!;

    return {
      ...booking,
      space,
      conversation,
    };
  }

  const allResourceBookings = await getResourceBookingByUserId(booking.id);
  if (!allResourceBookings) {
    const space = allSpaces.find((s) => s.id === booking.spaceId)!;

    return {
      ...booking,
      space,
      conversation,
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
    conversation,
  };
}
