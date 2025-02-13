'use server';

import { db } from '@/lib/db/drizzle';
import { spaces } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const getAllSpaces = async () => {
  try {
    const spacesList = await db.select().from(spaces);

    return spacesList;
  } catch {
    return null;
  }
};

export const getSpaceById = async (id: string) => {
  try {
    const [space] = await db.select().from(spaces).where(eq(spaces.id, id));

    return space;
  } catch {
    return null;
  }
};
