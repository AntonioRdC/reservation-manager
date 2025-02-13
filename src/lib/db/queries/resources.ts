'use server';

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

export const createRosource = async (name: string, quantity: number) => {
  try {
    const [resource] = await db
      .insert(resources)
      .values({ name, quantity })
      .returning();

    return resource;
  } catch {
    return null;
  }
};
