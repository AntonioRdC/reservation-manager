'use server';

import * as z from 'zod';

import { createResourceBooking } from '@/lib/db/queries/resource-booking';
import { createBooking } from '@/lib/db/queries/bookings';
import { currentUser } from '@/lib/auth/hooks/get-current-user';

import { ReservationFormSchema } from '@/app/(app)/(reservation)/reservation/schema';

export const createBookingAction = async (
  values: z.infer<typeof ReservationFormSchema>,
) => {
  const validatedFields = ReservationFormSchema.safeParse(values);
  const user = await currentUser();

  if (!validatedFields.success) {
    return { error: 'Campos inválidos!' };
  }

  const { space, category, date, startTime, endTime, resources } =
    validatedFields.data;

  if (!user?.id) {
    return { error: 'Usuário não autenticado!' };
  }

  const parsedStartTime = new Date(date);
  const parsedEndTime = new Date(date);

  const [startHour, startMinutes, startPeriod] = startTime
    .replace(/:/g, ' ')
    .split(' ');
  const [endHour, endMinutes, endPeriod] = endTime
    .replace(/:/g, ' ')
    .split(' ');

  parsedStartTime.setHours(
    startPeriod === 'PM' ? parseInt(startHour) + 12 : parseInt(startHour),
    parseInt(startMinutes),
  );
  parsedEndTime.setHours(
    endPeriod === 'PM' ? parseInt(endHour) + 12 : parseInt(endHour),
    parseInt(endMinutes),
  );

  if (!category) {
    return { error: 'A categoria é obrigatório.' };
  }

  const bookingData = {
    spaceId: space,
    userId: user.id,
    startTime: parsedStartTime,
    endTime: parsedEndTime,
    category,
  };

  const reservation = await createBooking(bookingData);

  if (reservation) {
    if (resources) {
      for (const i in resources) {
        const resource = await createResourceBooking({
          bookingId: reservation?.id,
          resourceId: resources[i].id,
          quantity: resources[i].quantity,
        });

        if (!resource) {
          return { error: 'Ocorreu um erro, por favor tente mais tarde' };
        }
      }
    }

    return { success: true };
  }
  return { error: 'Ocorreu um erro, por favor tente mais tarde' };
};
