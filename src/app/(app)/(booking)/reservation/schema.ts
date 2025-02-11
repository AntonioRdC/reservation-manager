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
  image: z
    .union([
      z
        .instanceof(File)
        .refine(
          (file) => ['image/jpeg', 'image/png'].includes(file.type),
          'O formato da imagem deve ser JPEG, PNG.',
        )
        .refine(
          (file) => file.size <= 5 * 1024 * 1024,
          'A imagem deve ter no máximo 5MB.',
        ),
      z.string().url('A imagem deve ser uma URL válida.'),
    ])
    .optional()
    .nullable(),
});
