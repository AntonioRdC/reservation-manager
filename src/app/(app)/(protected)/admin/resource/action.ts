'use server';

import { deleteRosource } from '@/lib/db/queries/resources';
import { getResourceBookingsByResourceId } from '@/lib/db/queries/resource-booking';

export const deleteResourceAction = async (id: string) => {
  const bookings = await getResourceBookingsByResourceId(id);
  if (bookings === null) {
    return null;
  }

  const resource = await deleteRosource(id);

  return resource;
};
