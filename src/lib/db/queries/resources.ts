import { db } from '@/lib/db/drizzle';
import { resources } from '@/lib/db/schema';

export const getAllResources = async () => {
  try {
    const resourcesList = await db.select().from(resources);

    return resourcesList;
  } catch {
    return null;
  }
};
