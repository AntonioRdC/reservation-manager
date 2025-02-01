'use server';

import { compare, hash } from 'bcryptjs';
import * as z from 'zod';

import {
  UpdateAccountFormSchema,
  UpdatePasswordFormSchema,
} from '@/app/(app)/dashboard/schema';
import {
  getUserByEmail,
  updateNameAndEmailUser,
  updatePasswordUser,
} from '@/lib/db/queries/users';
import { ActivityType } from '@/lib/db/schema';
import { logActivity } from '@/app/actions';
import { currentUser } from '@/lib/auth/hooks/get-current-user';

export const updateAccountAction = async (
  values: z.infer<typeof UpdateAccountFormSchema>,
) => {
  const validatedFields = UpdateAccountFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Campo Inválido' };
  }

  const { name, email } = validatedFields.data;

  const user = await currentUser();

  if (!user) {
    return { error: 'Algo deu errado' };
  }

  await Promise.all([
    updateNameAndEmailUser(user.id!, name, email),
    logActivity(user.id!, ActivityType.UPDATE_PASSWORD),
  ]);

  return { success: 'Conta atualizada com sucesso.' };
};

export const updatePasswordAction = async (
  values: z.infer<typeof UpdatePasswordFormSchema>,
  email: string,
) => {
  const validatedFields = UpdatePasswordFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Senha inválida' };
  }

  const user = await getUserByEmail(email);

  if (!user) {
    return { error: 'Algo deu errado' };
  }

  const { currentPassword, newPassword } = validatedFields.data;

  const isPasswordValid = compare(currentPassword, user.password!);

  if (!isPasswordValid) {
    return { error: 'Senha atual incorreta.' };
  }

  if (currentPassword === newPassword) {
    return {
      error: 'A nova senha deve ser diferente da senha atual.',
    };
  }

  const newPasswordHash = await hash(newPassword, 10);

  await Promise.all([
    updatePasswordUser(user.id, newPasswordHash),
    logActivity(user.id, ActivityType.UPDATE_PASSWORD),
  ]);

  return { success: 'Senha atualizada com sucesso.' };
};
