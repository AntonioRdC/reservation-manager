import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/stripe/stripe-server';
import { updateStatusBooking } from '@/lib/db/queries/bookings';

export async function POST(req: NextRequest) {
  try {
    const { bookingId, amount, description } = await req.json();

    if (!bookingId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const amountInCents = Math.round(amount * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: 'Reserva de Espaço',
              description:
                description || `Pagamento para reserva #${bookingId}`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/reservation/${bookingId}?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/reservation/${bookingId}?payment=canceled`,
      metadata: {
        bookingId,
      },
    });

    await updateStatusBooking(bookingId, 'CONFIRMED');

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 },
    );
  }
}
