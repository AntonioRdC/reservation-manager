'use server';

import { updateStatusBooking } from '@/lib/db/queries/bookings';
import { ExtendedUser } from '@/lib/auth/next-auth';

export const confirmedBooking = async (
  user: ExtendedUser | undefined,
  id: string,
) => {
  if (user?.role === 'ADMIN') {
    return await updateStatusBooking(id, 'PAYMENT');
  }
};

export const cancelledBooking = async (
  user: ExtendedUser | undefined,
  id: string,
) => {
  if (user?.role === 'ADMIN') {
    return await updateStatusBooking(id, 'CANCELLED');
  }
};
