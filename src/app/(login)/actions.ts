'use server';

import { signOut } from '@/lib/auth/auth';
import { AuthError } from 'next-auth';
import { compare, hash } from 'bcryptjs';
import * as z from 'zod';

import { sendPasswordResetEmail, sendVerificationEmail } from '@/lib/mail';
import { DEFAULT_LOGIN_REDIRECT } from '@/lib/auth/routes';
import {
  deletePasswordResetToken,
  getPasswordResetTokenByToken,
} from '@/lib/db/queries/password-reset-tokens';
import {
  deleteVerificationToken,
  getVerificationTokenByToken,
} from '@/lib/db/queries/verificiation-tokens';
import {
  generatePasswordResetToken,
  generateVerificationToken,
} from '@/lib/tokens';
import { signIn } from '@/lib/auth/auth';
import {
  createUser,
  getUserByEmail,
  updateEmailVerifiedUser,
  updatePasswordUser,
} from '@/lib/db/queries/users';
import {
  NewPasswordFormSchema,
  ResetPasswordFormSchema,
  SignInFormSchema,
  SignUpFormSchema,
  UpdatePasswordFormSchema,
} from '@/app/(login)/schema';
import { ActivityType, NewActivityLog } from '@/lib/db/schema';
import { createActivityLog } from '@/lib/db/queries/activity-logs';

async function logActivity(
  userId: string,
  type: ActivityType,
  ipAddress?: string,
) {
  const newActivity: NewActivityLog = {
    userId,
    action: type,
    ipAddress: ipAddress || '',
  };

  await createActivityLog(newActivity);
}

export const signUpAction = async (
  values: z.infer<typeof SignUpFormSchema>,
) => {
  const validatedFields = SignUpFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Email ou senha inválidos' };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: 'Email inválido' };
  }

  await createUser(name, email, hashedPassword);

  const verificationToken = await generateVerificationToken(email);

  if (!verificationToken) {
    return { error: 'Ocorreu um erro no servidor' };
  }

  await sendVerificationEmail(
    verificationToken.identifier,
    verificationToken.token,
  );

  return { success: 'Email de confirmação enviado' };
};

export const signInAction = async (
  values: z.infer<typeof SignInFormSchema>,
  callbackUrl?: string | null,
) => {
  const validatedFields = SignInFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Email ou senha inválidos' };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: 'Email ou senha inválidos' };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email,
    );

    if (!verificationToken) {
      return { error: 'Ocorreu um erro no servidor' };
    }

    await sendVerificationEmail(
      verificationToken.identifier,
      verificationToken.token,
    );

    return { success: 'Email de confirmação enviado' };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Email ou senha inválidos' };
        default:
          return { error: 'Algo deu errado' };
      }
    }

    throw error;
  }
};

export const signInGoogleAction = async (provider: string) => {
  await signIn(provider, {
    callbackUrl: DEFAULT_LOGIN_REDIRECT,
  });
};

export const signOutAction = async () => {
  await signOut();
};

export const newVerificationAction = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: 'Token não existe' };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: 'O token expirou' };
  }

  const existingUser = await getUserByEmail(existingToken.identifier);

  if (!existingUser) {
    return { error: 'Email não existe' };
  }

  await updateEmailVerifiedUser(existingUser.id, existingToken.identifier);

  await deleteVerificationToken(existingToken.identifier);

  return { success: 'Email verificado' };
};

export const newPasswordAction = async (
  values: z.infer<typeof NewPasswordFormSchema>,
  token?: string | null,
) => {
  if (!token) {
    return { error: 'Token ausente' };
  }

  const validatedFields = NewPasswordFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Campos inválidos' };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: 'Token inválido' };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: 'O token expirou' };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: 'Email não existe' };
  }

  const hashedPassword = await hash(password, 10);

  await updatePasswordUser(existingUser.id, hashedPassword);

  await deletePasswordResetToken(existingToken.id);

  return { success: 'Senha atualizada!' };
};

export const resetPasswordAction = async (
  values: z.infer<typeof ResetPasswordFormSchema>,
) => {
  const validatedFields = ResetPasswordFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Email inválido' };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: 'Email não encontrado' };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token,
  );

  return {
    success:
      'Email de redefinição enviado, por favor, verifique sua caixa de mensagem',
  };
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
