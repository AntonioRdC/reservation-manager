'use server';

import * as z from 'zod';

import { createResourceBooking } from '@/lib/db/queries/resource-booking';
import { createBooking } from '@/lib/db/queries/bookings';
import { currentUser } from '@/lib/auth/hooks/get-current-user';

import { ReservationFormSchema } from '@/app/(app)/(reservation)/reservation/schema';
import { createConversation } from '@/lib/db/queries/conversation';
import { createConversationParticipants } from '@/lib/db/queries/conversation-participants';
import { parse, isBefore, set, addHours } from 'date-fns';

export const createBookingAction = async (
  values: z.infer<typeof ReservationFormSchema>,
) => {
  console.log('Starting booking creation with values:', values);
  const validatedFields = ReservationFormSchema.safeParse(values);
  const user = await currentUser();
  console.log('Current user:', user);

  if (!validatedFields.success) {
    console.error('Validation failed:', validatedFields.error);
    return { error: 'Campos inválidos!' };
  }

  const { space, category, date, startTime, endTime, resources } =
    validatedFields.data;
  console.log('Validated data:', { space, category, date, startTime, endTime });

  if (!user?.id) {
    console.error('No authenticated user found');
    return { error: 'Usuário não autenticado!' };
  }

  if (!category) {
    console.error('Category is required but not provided');
    return { error: 'A categoria é obrigatório.' };
  }

  const [startHour, startMinutes] = startTime.replace(/:/g, ' ').split(' ');
  const [endHour, endMinutes] = endTime.replace(/:/g, ' ').split(' ');

  const parsedStartTime = set(date, {
    hours: parseInt(startHour),
    minutes: parseInt(startMinutes),
    seconds: 0,
    milliseconds: 0,
  });

  const parsedEndTime = set(date, {
    hours: parseInt(endHour),
    minutes: parseInt(endMinutes),
    seconds: 0,
    milliseconds: 0,
  });

  const bookingData = {
    spaceId: space,
    userId: user.id,
    startTime: parsedStartTime,
    endTime: parsedEndTime,
    category,
  };

  console.log('Creating booking with data:', bookingData);

  try {
    const reservation = await createBooking(bookingData);
    console.log('Booking created:', reservation);

    if (reservation) {
      const conversation = await createConversation(reservation.id);
      console.log('Conversation created:', conversation);

      const conversationParticipants = await createConversationParticipants(
        conversation!.id,
        user.id,
      );
      console.log(
        'Conversation participants created:',
        conversationParticipants,
      );

      if (resources) {
        console.log('Processing resources:', resources);
        for (const i in resources) {
          console.log(
            `Creating resource booking for resource ${i}:`,
            resources[i],
          );
          const resource = await createResourceBooking({
            bookingId: reservation?.id,
            resourceId: resources[i].id,
            quantity: resources[i].quantity,
          });

          if (!resource) {
            console.error(
              'Failed to create resource booking for:',
              resources[i],
            );
            return { error: 'Ocorreu um erro, por favor tente mais tarde' };
          }
          console.log('Resource booking created:', resource);
        }
      }

      return { success: true };
    }
    console.error('Reservation creation failed');
    return { error: 'Ocorreu um erro, por favor tente mais tarde' };
  } catch (error) {
    console.error('Error creating booking:', error);
    return { error: 'Ocorreu um erro, por favor tente mais tarde' };
  }
};
