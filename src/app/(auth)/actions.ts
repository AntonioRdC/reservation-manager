'use server';

import { signOut } from '@/lib/auth/auth';
import { hash, compare } from 'bcryptjs';
import * as z from 'zod';

import { sendPasswordResetEmail, sendVerificationEmail } from '@/lib/mail';
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
import {
  createUser,
  updateEmailVerifiedUser,
  updatePasswordUser,
  getUserByEmail,
} from '@/lib/db/queries/users';
import {
  NewPasswordFormSchema,
  ResetPasswordFormSchema,
  SignUpFormSchema,
  SignInFormSchema,
} from '@/app/(auth)/schema';

export const signUpAction = async (
  values: z.infer<typeof SignUpFormSchema>,
) => {
  const validatedFields = SignUpFormSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: 'Email ou senha inválidos' };
  }

  const { email, password, name } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { error: 'Email já cadastrado' };
  }

  const hashedPassword = await hash(password, 10);

  await createUser(name, email, hashedPassword);

  const verificationToken = await generateVerificationToken(email);
  if (!verificationToken) {
    return {
      error: 'Ocorreu um erro no servidor, por favor, tente mais tarde',
    };
  }

  await sendVerificationEmail(
    verificationToken.identifier,
    verificationToken.token,
  );

  return { success: 'Email de confirmação enviado' };
};

export const signInAction = async (
  values: z.infer<typeof SignInFormSchema>,
) => {
  const validatedFields = SignInFormSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: 'Email ou senha inválidos' };
  }

  const { email, password } = validatedFields.data;

  const user = await getUserByEmail(email);
  if (!user || !user.email || !user.password)
    return { error: 'Email ou senha inválidos' };

  if (!user.emailVerified) {
    const verificationToken = await generateVerificationToken(user.email);

    await sendVerificationEmail(
      verificationToken.identifier,
      verificationToken.token,
    );

    return { success: 'Email de confirmação enviado!' };
  }

  const passwordsMatch = await compare(password, user?.password!);
  if (!passwordsMatch) return { error: 'Email ou senha inválidos' };

  return { email, password };
};

export const signOutAction = async () => {
  await signOut({ redirectTo: '/' });
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
