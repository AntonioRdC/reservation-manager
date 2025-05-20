'use server';

import { deleteSpace } from '@/lib/db/queries/spaces';

export const deleteSpaceAction = async (id: string) => {
  console.log('id', id);

  const resource = await deleteSpace(id);

  return resource;
};
