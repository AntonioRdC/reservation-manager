import { z } from 'zod';

export const SpacesFormSchema = z.object({
  name: z
    .string({
      required_error: 'O nome é obrigatório',
      invalid_type_error: 'O nome deve ser um texto',
    })
    .min(1, 'O nome deve ter pelo menos 1 caractere'),
  description: z.string({
    required_error: 'O descrição é obrigatório',
    invalid_type_error: 'O descrição deve ser um texto',
  }),
  capacity: z.preprocess(
    (val) => Number(val),
    z
      .number({
        required_error: 'A capacidade é obrigatório',
        invalid_type_error: 'A capacidade deve ser um número',
      })
      .min(1, 'A capacidade deve ser maior ou igual a 1'),
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
