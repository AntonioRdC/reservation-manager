'use client';

import { useEffect, useState } from 'react';
import { useCurrentUser } from '@/lib/auth/hooks/use-current-user';
import {
  getUserBookings,
  UserBookings,
} from '@/app/(app)/(booking)/dashboard/action';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { formatStartTime } from './utils';

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

export function ReservationStatus() {
  const user = useCurrentUser();
  const [bookings, setBookings] = useState<UserBookings[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (user?.id) {
        const userBookings = await getUserBookings(user.id);
        setBookings(userBookings);
      }
    };

    fetchBookings();
  }, [user]);

  return (
    <div className="space-y-4">
      {bookings.length > 0 ? (
        bookings.map((booking) => (
          <Card key={booking.id}>
            <CardHeader>
              <CardTitle className="font-bold text-lg">
                {formatStartTime(booking.startTime)}
              </CardTitle>
              <Badge
                className={`w-fit ${statusMap[booking.status]?.colorClass}`}
              >
                {statusMap[booking.status]?.label}
              </Badge>
            </CardHeader>
            <CardContent>
              <div>
                <span className="text-rose-400">
                  {new Date(booking.startTime).toLocaleString()} -{' '}
                  {new Date(booking.endTime).toLocaleString()}
                </span>
                <br />
                Espaço: {booking.space.name}
                <br />
                Categoria: {categoryMap[booking.category]}
              </div>

              {booking.image && (
                <div className="mt-2 flex items-center gap-2">
                  <Avatar className="w-16 h-16">
                    <AvatarImage
                      src={booking.image}
                      alt="Imagem do agendamento"
                    />
                  </Avatar>
                </div>
              )}

              {booking.resources && booking.resources.length > 0 && (
                <>
                  <h4 className="font-semibold">Recursos Utilizados:</h4>
                  <ul className="space-y-1">
                    {booking.resources.map((resource) => (
                      <li key={resource.id}>
                        {resource.name} - Quantidade: {resource.quantity}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-gray-500">Nenhum agendamento encontrado.</p>
      )}
    </div>
  );
}
