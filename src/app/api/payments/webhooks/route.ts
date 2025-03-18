import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import stripe from '@/lib/stripe/stripe-server';
import { getBookingById, updateStatusBooking } from '@/lib/db/queries/bookings';
import Stripe from 'stripe';
import { getAdmins, getUserById } from '@/lib/db/queries/users';
import { getSpaceById } from '@/lib/db/queries/spaces';
import { sendCalendarInvite } from '@/lib/mail';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable: ReadableStream) {
  const reader = readable.getReader();
  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value instanceof Uint8Array ? Buffer.from(value) : value);
  }
  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  try {
    const headersList = await headers();
    const sig = headersList.get('stripe-signature') as string;
    const buf = await buffer(req.body as ReadableStream);

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 },
      );
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.payment_status === 'paid') {
          const bookingId = session.metadata?.bookingId;

          if (bookingId) {
            await updateStatusBooking(bookingId, 'CONFIRMED');
            console.log(`Payment for booking ${bookingId} confirmed`);

            const booking = await getBookingById(bookingId);
            const space = await getSpaceById(booking!.spaceId);
            console.log(booking, space);
            if (booking && space) {
              const user = await getUserById(booking.userId);
              const admins = await getAdmins();
              const adminEmails = admins!
                .map((admin) => admin.email)
                .filter(Boolean) as string[];

              console.log(user, admins, adminEmails);
              if (user?.email) {
                await sendCalendarInvite(
                  booking,
                  space,
                  user.email,
                  adminEmails,
                );
              }
            }
          }
        }
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const session = await stripe.checkout.sessions.retrieve(
          paymentIntent.metadata?.checkout_session_id as string,
        );

        const bookingId = session.metadata?.bookingId;

        if (bookingId) {
          await updateStatusBooking(bookingId, 'PAYMENT');
          console.log(`Payment for booking ${bookingId} failed`);
        }
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 },
    );
  }
}
