'use server';

import { updateAdminUser } from '@/lib/db/queries/users';

export async function updateAdminUserAction(userId: string) {
  return await updateAdminUser(userId);
}
