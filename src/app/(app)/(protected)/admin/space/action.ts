'use server';

import { getBookingsBySpaceId } from '@/lib/db/queries/bookings';
import { deleteSpace } from '@/lib/db/queries/spaces';

export const deleteSpaceAction = async (id: string) => {
  const bookings = await getBookingsBySpaceId(id);
  if (bookings) {
    return null;
  }

  const resource = await deleteSpace(id);

  return resource;
};
