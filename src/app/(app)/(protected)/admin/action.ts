import { z } from 'zod';
import { ResourcesFormSchema, SpacesFormSchema } from './schema';
import { createSpace } from '@/lib/db/queries/spaces';
import { createRosource } from '@/lib/db/queries/resources';

export const createdSpacesAction = async (
  values: z.infer<typeof SpacesFormSchema>,
) => {
  const { name, capacity, description } = values;

  const space = await createSpace(name, capacity, description);

  return space;
};

export const createdResourcesAction = async (
  values: z.infer<typeof ResourcesFormSchema>,
) => {
  const { name, quantity } = values;

  const resource = await createRosource(name, quantity);

  return resource;
};
