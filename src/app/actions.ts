import { ActivityType, NewActivityLog } from '@/lib/db/schema';
import { createActivityLog } from '@/lib/db/queries/activity-logs';

export const logActivity = async (
  userId: string,
  type: ActivityType,
  ipAddress?: string,
) => {
  const newActivity: NewActivityLog = {
    userId,
    action: type,
    ipAddress: ipAddress || '',
  };

  await createActivityLog(newActivity);
};
