'use server';

import { createTransport } from 'nodemailer';
import { generateCalendarEvent } from './calendar';
import type { Booking, Space } from '@/lib/db/schema';

const domain = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const transporter = createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/new-verification?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Confirme seu email',
    html: `<p>Clique <a href="${confirmLink}">aqui</a> para confirmar seu email.</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/new-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Resetar sua senha',
    html: `<p>Clique <a href="${resetLink}">aqui</a> para resetar sua senha.</p>`,
  });
};

export async function sendCalendarInvite(
  booking: Booking,
  space: Space,
  userEmail: string,
  adminEmails: string[],
) {
  try {
    const calendarEvent = generateCalendarEvent(booking, space);

    const spaceName = space.name || 'Espaço';
    const formattedDate = new Date(booking.startTime).toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      },
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Confirmação de Reserva - ${spaceName}`,
      html: `
        <h1>Sua reserva foi confirmada!</h1>
        <p>Olá, sua reserva para <strong>${spaceName}</strong> foi confirmada para <strong>${formattedDate}</strong>.</p>
        <p>Você pode adicionar este evento ao seu calendário clicando no anexo.</p>
        <p>Para ver mais detalhes da sua reserva, acesse: <a href="${domain}/reservation/${booking.id}">Link da reserva</a></p>
      `,
      attachments: [
        {
          filename: 'calendario-reserva.ics',
          content: Buffer.from(calendarEvent),
        },
      ],
    });

    if (adminEmails.length) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: adminEmails.join(','),
        subject: `Nova Reserva Confirmada - ${spaceName}`,
        html: `
          <h1>Nova reserva confirmada</h1>
          <p>Uma reserva foi confirmada para <strong>${spaceName}</strong> no dia <strong>${formattedDate}</strong>.</p>
          <p>Categoria: ${booking.category}</p>
          <p>Você pode adicionar este evento ao seu calendário clicando no anexo.</p>
          <p>Para ver mais detalhes da reserva, acesse: <a href="${domain}/reservation/${booking.id}">Link da reserva</a></p>
        `,
        attachments: [
          {
            filename: 'calendario-reserva-admin.ics',
            content: Buffer.from(calendarEvent),
          },
        ],
      });
    }

    return true;
  } catch (error) {
    return false;
  }
}
