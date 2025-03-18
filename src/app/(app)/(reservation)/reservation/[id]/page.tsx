import { currentUser } from '@/lib/auth/hooks/get-current-user';
import { getUserById } from '@/lib/db/queries/users';
import { redirect } from 'next/navigation';
import { getBookingById } from '@/lib/db/queries/bookings';
import ReservationInformation from './reservation-information';

interface ReservationIdPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ReservationIdPage({
  params,
}: ReservationIdPageProps) {
  const resolvedParams = await params;
  const bookingId = resolvedParams.id;

  const user = await currentUser();

  if (!user) {
    redirect('/dashboard');
  }

  const booking = await getBookingById(bookingId);

  if (!booking) {
    redirect('/dashboard');
  }

  const userReservation = await getUserById(booking.userId);

  if (!userReservation) {
    redirect('/dashboard');
  }

  if (user.id !== userReservation.id && user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return <ReservationInformation />;
}
