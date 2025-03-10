'use server';

import { desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';

import { activityLogs, NewActivityLog, users } from '@/lib/db/schema';
import { currentUser } from '@/lib/auth/hooks/get-current-user';

export const createActivityLog = async (payload: NewActivityLog) => {
  try {
    const [newActivityLog] = await db
      .insert(activityLogs)
      .values(payload)
      .returning();

    return newActivityLog;
  } catch (error) {
    return null;
  }
};

export async function getActivityLogs() {
  const user = await currentUser();

  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  const logs = await db
    .select({
      id: activityLogs.id,
      action: activityLogs.action,
      timestamp: activityLogs.timestamp,
      ipAddress: activityLogs.ipAddress,
      userName: users.name,
    })
    .from(activityLogs)
    .leftJoin(users, eq(activityLogs.userId, users.id))
    .where(eq(activityLogs.userId, user.id!))
    .orderBy(desc(activityLogs.timestamp))
    .limit(10);

  return logs;
}
