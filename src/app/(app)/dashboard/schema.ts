import * as z from 'zod';

export const UpdateAccountFormSchema = z.object({
  name: z.string().min(1, { message: 'O nome é obrigatório' }),
  email: z.string().email({ message: 'O email é obrigatório' }),
});

export const UpdatePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(8).max(100),
    newPassword: z.string().min(8).max(100),
    confirmPassword: z.string().min(8).max(100),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });
