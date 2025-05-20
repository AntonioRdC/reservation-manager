'use server';

import { db } from '@/lib/db/drizzle';
import { resources } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

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

export const deleteRosource = async (id: string) => {
  try {
    const [deletedResource] = await db
      .delete(resources)
      .where(eq(resources.id, id))
      .returning();

    return deletedResource;
  } catch {
    return null;
  }
};

export const incrementResourceCount = async (id: string) => {
  try {
    const [resource] = await db
      .update(resources)
      .set({ quantity: sql`${resources.quantity} + 1` })
      .where(eq(resources.id, id))
      .returning();

    return resource;
  } catch {
    return null;
  }
};

export const decrementResourceCount = async (id: string) => {
  try {
    const [resource] = await db
      .update(resources)
      .set({ quantity: sql`${resources.quantity} - 1` })
      .where(eq(resources.id, id))
      .returning();

    return resource;
  } catch {
    return null;
  }
};
