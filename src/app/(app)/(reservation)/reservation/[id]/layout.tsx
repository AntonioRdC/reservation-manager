import { currentUser } from '@/lib/auth/hooks/get-current-user';
import { getUserById } from '@/lib/db/queries/users';
import { redirect } from 'next/navigation';
import { getBookingById } from '@/lib/db/queries/bookings';

export default async function ReservationIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  const bookingId = resolvedParams.id;
  const user = await currentUser();

  if (!user) {
    redirect('/dashboard');
  }

  const booking = await getBookingById(bookingId);

  if (!booking) {
    redirect('/dashboard');
  }

  const userReservation = await getUserById(booking!.userId);

  if (!userReservation) {
    redirect('/dashboard');
  }

  if (user.id !== userReservation.id && user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return <>{children}</>;
}
