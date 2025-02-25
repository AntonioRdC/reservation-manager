import { z } from 'zod';
import { ResourcesFormSchema } from './schema';
import { createRosource } from '@/lib/db/queries/resources';

export const createResourcesAction = async (
  values: z.infer<typeof ResourcesFormSchema>,
) => {
  const { name, quantity } = values;

  const resource = await createRosource(name, quantity);

  return resource;
};
