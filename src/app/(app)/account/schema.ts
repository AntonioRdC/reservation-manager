import * as z from 'zod';

export const UpdateAccountFormSchema = z.object({
  name: z.string().min(1, { message: 'O nome é obrigatório' }),
  email: z
    .string()
    .email({ message: 'Email inválido' })
    .or(z.literal(''))
    .optional(),
  telefone: z
    .string()
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, {
      message: 'Telefone deve estar no formato (99) 99999-9999',
    })
    .or(z.literal(''))
    .optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z
    .string()
    .min(2)
    .max(2, { message: 'Use a sigla do estado com 2 letras' })
    .or(z.literal(''))
    .optional(),
  zipCode: z
    .string()
    .regex(/^\d{5}-\d{3}$/, { message: 'CEP deve estar no formato 99999-999' })
    .or(z.literal(''))
    .optional(),
  country: z.string().optional().default('Brasil'),
});

export const UpdatePasswordFormSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, 'Senha inválida')
      .max(100, 'Senha inválida'),
    newPassword: z
      .string()
      .min(8, 'Mínimo de 8 character(s)')
      .max(100, 'Máximo de 100 character(s)'),
    confirmPassword: z
      .string()
      .min(8, 'Mínimo de 8 character(s)')
      .max(100, 'Máximo de 100 character(s)'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export const DeleteAccountFormSchema = z.object({
  password: z.string().min(8, 'Senha inválida').max(100, 'Senha inválida'),
});
