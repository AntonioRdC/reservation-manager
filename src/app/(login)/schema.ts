'use client';

import * as z from 'zod';

export const SignUpFormSchema = z.object({
  email: z.string().email({
    message: 'O email é obrigatório',
  }),
  password: z.string().min(8, {
    message: 'Mínimo de 8 caracteres requerido para a senha',
  }),
  name: z.string().min(1, {
    message: 'O nome é obrigatório',
  }),
});

export const SignInFormSchema = z.object({
  email: z.string().email({
    message: 'O email é obrigatório',
  }),
  password: z.string().min(1, {
    message: 'A senha é obrigatória',
  }),
});

export const NewPasswordFormSchema = z.object({
  password: z.string().min(8, {
    message: 'Mínimo de 8 caracteres requerido',
  }),
});

export const ResetPasswordFormSchema = z.object({
  email: z.string().email({
    message: 'O email é obrigatório',
  }),
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
