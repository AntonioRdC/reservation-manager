import ical, { ICalEventStatus } from 'ical-generator';
import type { Booking, Space } from '@/lib/db/schema';

export function generateCalendarEvent(booking: Booking, space: Space) {
  const calendar = ical({
    prodId: { company: 'Reservation Manager', product: 'ReservationSystem' },
    name: 'Reserva de Espaço',
  });

  const formattedLocation = formatLocation(space);

  calendar.createEvent({
    start: new Date(booking.startTime),
    end: new Date(booking.endTime),
    summary: `Reserva: ${space.name || 'Espaço'}`,
    description: space.description || 'Detalhes da sua reserva',
    location: formattedLocation,
    organizer: {
      name: 'Sistema de Reservas',
      email: process.env.EMAIL_FROM || 'noreply@seudominio.com',
    },
    status: ICalEventStatus.CONFIRMED,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/reservation/${booking.id}`,
  });

  return calendar.toString();
}

function formatLocation(space: Space): string {
  if (!space.address) return 'Endereço não informado';

  const components = [
    space.name,
    space.address,
    space.city,
    space.state,
    space.zipCode,
    space.country || 'Brasil',
  ];

  const filteredComponents = components.filter(Boolean);

  return filteredComponents.join(', ');
}
