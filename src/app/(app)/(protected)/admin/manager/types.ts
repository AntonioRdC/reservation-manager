import { Booking, User, Space } from '@/lib/db/schema';

export type { Booking, User, Space };

export type BookingData = {
  booking: Booking;
  user: User;
  space: Space;
};
