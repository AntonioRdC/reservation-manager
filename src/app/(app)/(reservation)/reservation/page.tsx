import { AlertCircle } from 'lucide-react';

import { ReservationForm } from '@/app/(app)/(reservation)/reservation/components/reservation-form';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getAllResources } from '@/lib/db/queries/resources';
import { getAllSpaces } from '@/lib/db/queries/spaces';
import { getAllBookings } from '@/lib/db/queries/bookings';

export default async function BookingPage() {
  const resources = await getAllResources();
  const spaces = await getAllSpaces();
  const reservations = await getAllBookings();

  if (!spaces || !resources || !reservations) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <AlertCircle className="h-12 w-12 text-rose-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Sem Espaços Disponíveis
        </h3>
        <p className="text-sm text-gray-500 max-w-sm">
          Por favor, volte mais tarde para fazer uma reserva.
        </p>
      </div>
    );
  }

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium bold text-rose-500 mb-6">
        Minhas Reservas
      </h1>

      <Card>
        <CardHeader>Escolha o espaço, o horário...</CardHeader>
        <CardContent>
          <ReservationForm
            spaces={spaces}
            resources={resources}
            reservations={reservations}
          />
        </CardContent>
      </Card>
    </section>
  );
}
