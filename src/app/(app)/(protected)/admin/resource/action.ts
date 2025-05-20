'use server';

import {
  decrementResourceCount,
  deleteRosource,
  incrementResourceCount,
} from '@/lib/db/queries/resources';
import { getResourceBookingsByResourceId } from '@/lib/db/queries/resource-booking';

export const deleteResourceAction = async (id: string) => {
  const bookings = await getResourceBookingsByResourceId(id);
  if (bookings === null) {
    return null;
  }

  const resource = await deleteRosource(id);

  return resource;
};

export const addOneResourceAction = async (id: string) => {
  const resource = await incrementResourceCount(id);

  return resource;
};

export const removeOneResourceAction = async (id: string) => {
  const resource = await decrementResourceCount(id);

  return resource;
};
