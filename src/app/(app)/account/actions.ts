'use server';

import { compare, hash } from 'bcryptjs';
import * as z from 'zod';

import {
  DeleteAccountFormSchema,
  UpdateAccountFormSchema,
  UpdatePasswordFormSchema,
} from '@/app/(app)/account/schema';
import {
  deleteUserById,
  getUserByEmail,
  updateAccountUser,
  updatePasswordUser,
} from '@/lib/db/queries/users';
import { ActivityType } from '@/lib/db/schema';
import { logActivity } from '@/app/actions';
import { currentUser } from '@/lib/auth/hooks/get-current-user';
import { unstable_update } from '@/lib/auth/auth';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';
import { ExtendedUser } from '@/lib/auth/next-auth';
import { deleteAccountByUserId } from '@/lib/db/queries/accounts';
import { putS3generatePresignedUrl } from '@/lib/aws/aws';

export const updateAccountAction = async (
  values: z.infer<typeof UpdateAccountFormSchema>,
) => {
  const validatedFields = UpdateAccountFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Campos Inválidos' };
  }

  let { name, email, telefone, address, city, state, zipCode, country, image } =
    validatedFields.data;

  console.log(image);

  const user = await currentUser();

  const hasAddressFields =
    address !== undefined ||
    city !== undefined ||
    state !== undefined ||
    zipCode !== undefined ||
    country !== undefined;

  if (hasAddressFields) {
    if (!address || !city || !state || !zipCode || !country) {
      return { error: 'Todos os campos de endereço devem ser preenchidos' };
    }
  }

  if (!user) {
    return { error: 'Algo deu errado' };
  }

  if (user.isOAuth) {
    email = undefined;
  }

  let imageUrl = null;

  if (image instanceof File) {
    const presignedUrl = await putS3generatePresignedUrl(
      image.name,
      image.type,
    );

    if (presignedUrl === null) {
      return { error: 'Ocorreu um erro, por favor tente mais tarde' };
    }

    const imageS3 = await fetch(presignedUrl, {
      method: 'PUT',
      body: image,
      headers: {
        'Content-Type': image.type,
      },
    });

    if (imageS3.ok) {
      imageUrl = presignedUrl.split('?')[0];
    } else {
      return {
        error:
          'Ocorreu um erro ao fazer upload da imagem, por favor tente mais tarde',
      };
    }
  }

  await Promise.all([
    logActivity(user.id!, ActivityType.UPDATE_ACCOUNT),
    updateAccountUser(
      user.id!,
      name,
      email,
      imageUrl,
      undefined,
      telefone,
      address,
      city,
      state,
      zipCode,
      country,
    ),
    unstable_update({
      user: {
        name,
        email,
      },
    }),
  ]);

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return { error: 'Email já está em uso!' };
    }

    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail(
      verificationToken.identifier,
      verificationToken.token,
    );
  }

  if (!user.isUserValid) {
    if (telefone && address) {
      unstable_update({
        user: {
          isUserValid: true,
        },
      });
    }
  }

  return {
    data: {
      name,
      email,
      telefone,
      address,
      city,
      state,
      zipCode,
      country,
    },
    success: 'Conta atualizada com sucesso',
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

  const isPasswordValid = await compare(currentPassword, user.password!);

  if (!isPasswordValid) {
    return { error: 'Senha atual incorreta.' };
  }

  if (currentPassword === newPassword) {
    return {
      error: 'A nova senha deve ser diferente da senha atual',
    };
  }

  const newPasswordHash = await hash(newPassword, 10);

  await Promise.all([
    logActivity(user.id, ActivityType.UPDATE_PASSWORD),
    updatePasswordUser(user.id, newPasswordHash),
  ]);

  return { success: 'Senha atualizada com sucesso' };
};

export const deleteAccountAction = async (
  values: z.infer<typeof DeleteAccountFormSchema>,
  user: ExtendedUser,
) => {
  const validatedFields = DeleteAccountFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Senha incorreta, conta não deletada' };
  }

  const { password } = validatedFields.data;

  const existingUser = await getUserByEmail(user?.email!);

  if (!existingUser) {
    return { error: 'Algo deu errado' };
  }

  const isPasswordValid = compare(password, existingUser.password!);

  if (!isPasswordValid) {
    return { error: 'Senha incorreta, conta não deletada' };
  }

  await Promise.all([
    logActivity(user.id!, ActivityType.DELETE_ACCOUNT),
    deleteUserById(user.id!),
  ]);
};

export const deleteAccountGoogleAction = async (user: ExtendedUser) => {
  await Promise.all([
    logActivity(user.id!, ActivityType.DELETE_ACCOUNT),
    deleteAccountByUserId(user.id!),
    deleteUserById(user.id!),
  ]);
};
