'use server';

import { v4 as uuid } from 'uuid';

import {
  createVerificationToken,
  deleteVerificationToken,
  getVerificationTokenByEmail,
} from '@/lib/db/queries/verificiation-tokens';
import {
  createPasswordResetToken,
  deletePasswordResetToken,
  getPasswordResetTokenByEmail,
} from '@/lib/db/queries/password-reset-tokens';

export const generatePasswordResetToken = async (email: string) => {
  const token = uuid();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await deletePasswordResetToken(existingToken.id);
  }

  const passwordResetToken = await createPasswordResetToken(
    email,
    token,
    expires,
  );

  return passwordResetToken!;
};

export const generateVerificationToken = async (email: string) => {
  const token = uuid();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await deleteVerificationToken(existingToken.identifier);
  }

  const verficationToken = await createVerificationToken(email, token, expires);

  return verficationToken!;
};
