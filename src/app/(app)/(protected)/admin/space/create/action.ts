import { createSpace } from '@/lib/db/queries/spaces';
import { putS3generatePresignedUrl } from '@/lib/aws/aws';
import { SpacesFormSchema } from './schema';
import { z } from 'zod';

export const createdSpacesAction = async (
  values: z.infer<typeof SpacesFormSchema>,
) => {
  const { name, capacity, description, image } = values;

  let imageUrl = null;

  if (image instanceof File) {
    const presignedUrl = await putS3generatePresignedUrl(
      image.name,
      image.type,
    );

    if (presignedUrl === null) {
      return { error: 'Ocorreu um erro, por favor tente mais tarde' };
    }

    const imageS3 = await fetch(presignedUrl, {
      method: 'PUT',
      body: image,
      headers: {
        'Content-Type': image.type,
      },
    });

    if (imageS3.ok) {
      imageUrl = presignedUrl.split('?')[0];
    } else {
      return {
        error:
          'Ocorreu um erro ao fazer upload da imagem, por favor tente mais tarde',
      };
    }
  }

  const space = await createSpace(name, capacity, description, imageUrl);

  return space;
};
