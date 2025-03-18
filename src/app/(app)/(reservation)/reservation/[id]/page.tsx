'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatStartTime } from '@/app/(app)/utils';
import { Badge } from '@/components/ui/badge';
import { getUserBooking, UserBookings } from './action';
import { Chat } from './chat';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getStripe } from '@/lib/stripe/stripe-client';

const categoryMap: Record<string, string> = {
  PRESENTIAL_COURSE: 'Curso Presencial',
  ONLINE_COURSE: 'Curso Online',
  CONSULTANCY: 'Consultoria',
  VIDEOS: 'Vídeos',
};

const statusMap: Record<string, { label: string; colorClass: string }> = {
  REQUESTED: { label: 'Solicitado', colorClass: 'bg-blue-500' },
  PAYMENT: { label: 'Aguardando pagamento', colorClass: 'bg-yellow-500' },
  CONFIRMED: { label: 'Confirmado', colorClass: 'bg-green-500' },
  CANCELLED: { label: 'Cancelado', colorClass: 'bg-red-500' },
};

export default function ReservationPage() {
  const { id } = useParams();
  const [reservation, setReservation] = useState<UserBookings | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      getUserBooking(Array.isArray(id) ? id[0] : id)
        .then((data) => setReservation(data))
        .catch((error) => console.error('Error fetching reservation:', error));
    }
  }, [id]);

  const handlePayment = async () => {
    if (!reservation) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: reservation.id,
          amount: 1,
          description: `Reserva de ${reservation.space.name}`,
        }),
      });

      const { sessionId, url } = await response.json();

      if (url) {
        window.location.href = url;
      } else {
        const stripe = await getStripe();
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error('Error redirecting to checkout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!reservation) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium bold text-rose-500 mb-6">
        Reserva - {reservation.user.name} -{' '}
        {formatStartTime(reservation.startTime)}
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
          <div className="my-2 flex flex-col lg:flex-row items-center gap-2">
            {reservation.space.image && (
              <img
                src={reservation.space.image}
                alt="Imagem do espaço"
                className="object-cover w-full max-w-md h-auto rounded-lg"
              />
            )}
            <div className="flex w-full flex-col items-center lg:items-start lg:ml-4">
              <span className="text-rose-400">
                {new Date(reservation.startTime).toLocaleString()} -{' '}
                {new Date(reservation.endTime).toLocaleString()}
              </span>
              <br />
              Espaço: {reservation.space.name}
              <br />
              Categoria: {categoryMap[reservation.category]}
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
            </div>
          </div>
          {reservation.status === 'PAYMENT' && (
            <div className="flex justify-end mb-2">
              <Button onClick={handlePayment}>Ir para pagamento</Button>
            </div>
          )}
          <Chat conversationId={reservation.conversation.id} />
        </CardContent>
      </Card>
    </section>
  );
}
