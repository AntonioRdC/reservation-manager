import { Metadata } from 'next';

import { getAllBookings } from '@/lib/db/queries/bookings';
import { getUserById } from '@/lib/db/queries/users';
import { getSpaceById } from '@/lib/db/queries/spaces';

import DataTable from '@/app/(app)/(protected)/admin/manager/components/admin-data-table';

export const metadata: Metadata = {
  title: 'Admin',
  description: 'administration app',
};

export default async function AdminPage() {
  const bookings = await getAllBookings();

  const data = [];

  for (const booking of bookings!) {
    const [user, space] = await Promise.all([
      getUserById(booking.userId),
      getSpaceById(booking.spaceId),
    ]);

    if (user && space) {
      data.push({ booking, user, space });
    }
  }

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium bold text-rose-500 mb-6">
        Tabela de requisições das reservas
      </h1>

      <DataTable data={data} />
    </section>
  );
}
