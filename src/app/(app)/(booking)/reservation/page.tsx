import { AlertCircle } from 'lucide-react';

import { ReservationForm } from '@/app/(app)/(booking)/reservation/components/reservation-form';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getAllResources } from '@/lib/db/queries/resources';
import { getAllSpaces } from '@/lib/db/queries/spaces';

export default async function BookingPage() {
  const spaces = await getAllSpaces();
  const resources = await getAllResources();

  if (!spaces || !resources) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <AlertCircle className="h-12 w-12 text-rose-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Nenhuma atividade registrada
        </h3>
        <p className="text-sm text-gray-500 max-w-sm">
          Quando você realizar ações como fazer login ou atualizar sua conta,
          elas aparecerão aqui.
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
          <ReservationForm spaces={spaces} resources={resources} />
        </CardContent>
      </Card>
    </section>
  );
}
