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

export const createSpace = async ({
  name,
  capacity,
  description,
  image,
  address,
  city,
  state,
  zipCode,
  country = 'Brasil',
}: {
  name: string;
  capacity: number;
  description: string;
  image: string | null;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
}) => {
  try {
    const [newSpace] = await db
      .insert(spaces)
      .values({
        name,
        capacity,
        description,
        image,
        address,
        city,
        state,
        zipCode,
        country,
      })
      .returning();

    return newSpace;
  } catch (error) {
    console.error('Error creating space:', error);
    return null;
  }
};

export const deleteSpace = async (id: string) => {
  try {
    const [deletedSpace] = await db
      .delete(spaces)
      .where(eq(spaces.id, id))
      .returning();

    return deletedSpace;
  } catch (error) {
    console.error('Error deleting space:', error);
    return null;
  }
};
