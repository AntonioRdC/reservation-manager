import { z } from 'zod';

export const ResourcesFormSchema = z.object({
  name: z
    .string({
      required_error: 'O nome é obrigatório',
      invalid_type_error: 'O nome deve ser um texto',
    })
    .min(1, 'O nome deve ter pelo menos 1 caractere'),
  quantity: z.preprocess(
    (val) => Number(val),
    z
      .number({
        required_error: 'A quantidade é obrigatório',
        invalid_type_error: 'A quantidade deve ser um número',
      })
      .min(0, 'A quantidade não pode ser negativa'),
  ),
});
