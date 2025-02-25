import * as z from 'zod';

export const ReservationFormSchema = z.object({
  space: z.string().min(1, 'O espaço é obrigatório.'),
  category: z.enum([
    'PRESENTIAL_COURSE',
    'ONLINE_COURSE',
    'CONSULTANCY',
    'VIDEOS',
  ]),
  date: z.date(),
  startTime: z.string(),
  endTime: z.string(),
  resources: z.array(
    z.object({
      id: z.string(),
      quantity: z
        .number()
        .int('A quantidade deve ser um número inteiro.')
        .min(1, 'A quantidade mínima é 1.'),
    }),
  ),
});
