'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrentUser } from '@/lib/auth/hooks/use-current-user';
import { formatStartTime } from '@/app/(app)/utils';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getUserBooking, UserBookings } from './action';

const categoryMap: Record<string, string> = {
  PRESENTIAL_COURSE: 'Curso Presencial',
  ONLINE_COURSE: 'Curso Online',
  CONSULTANCY: 'Consultoria',
  VIDEOS: 'Vídeos',
};

const statusMap: Record<string, { label: string; colorClass: string }> = {
  REQUESTED: { label: 'Solicitado', colorClass: 'bg-blue-500' },
  CONFIRMED: { label: 'Confirmado', colorClass: 'bg-green-500' },
  CANCELLED: { label: 'Cancelado', colorClass: 'bg-red-500' },
};

const ReservationLayout = () => {
  const user = useCurrentUser();
  const { id } = useParams();
  const [reservation, setReservation] = useState<UserBookings | null>(null);

  useEffect(() => {
    if (id) {
      getUserBooking(Array.isArray(id) ? id[0] : id)
        .then((data) => setReservation(data))
        .catch((error) => console.error('Error fetching reservation:', error));
    }
  }, [id]);

  if (!reservation) {
    return <div>Loading...</div>;
  }

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium bold text-rose-500 mb-6">
        Reserva - {user?.name} - {formatStartTime(reservation.startTime)}
      </h1>

      <Card key={reservation.id}>
        <CardHeader>
          <CardTitle className="font-bold text-lg">
            {formatStartTime(reservation.startTime)}
          </CardTitle>
          <Badge
            className={`w-fit ${statusMap[reservation.status]?.colorClass}`}
          >
            {statusMap[reservation.status]?.label}
          </Badge>
        </CardHeader>
        <CardContent>
          <div>
            <span className="text-rose-400">
              {new Date(reservation.startTime).toLocaleString()} -{' '}
              {new Date(reservation.endTime).toLocaleString()}
            </span>
            <br />
            Espaço: {reservation.space.name}
            <br />
            Categoria: {categoryMap[reservation.category]}
          </div>

          {reservation.image && (
            <div className="mt-2 flex items-center gap-2">
              <Avatar className="w-16 h-16">
                <AvatarImage
                  src={reservation.image}
                  alt="Imagem do agendamento"
                />
              </Avatar>
            </div>
          )}

          {reservation.resources && reservation.resources.length > 0 && (
            <>
              <h4 className="font-semibold">Recursos Utilizados:</h4>
              <ul className="space-y-1">
                {reservation.resources.map((resource) => (
                  <li key={resource.id}>
                    {resource.name} - Quantidade: {resource.quantity}
                  </li>
                ))}
              </ul>
            </>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default ReservationLayout;
