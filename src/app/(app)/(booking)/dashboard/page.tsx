import { ReservationStatus } from '@/app/(app)/(booking)/dashboard/reservation-status';

export default async function DashboardPage() {
  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium bold text-rose-500 mb-6">
        Minhas Reservas
      </h1>
      <ReservationStatus />
    </section>
  );
}
