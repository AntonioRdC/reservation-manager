import * as z from 'zod';

export const UpdateAccountFormSchema = z.object({
  name: z.string().min(1, { message: 'O nome é obrigatório' }),
  email: z.optional(z.string().email({ message: 'O email é obrigatório' })),
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
