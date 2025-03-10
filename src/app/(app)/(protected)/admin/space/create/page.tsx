'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { FormSuccess } from '@/components/form-success';
import { FormError } from '@/components/form-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { SpacesFormSchema } from './schema';
import { ImageUploader } from '@/app/(app)/(reservation)/reservation/components/image-uploader';
import { createdSpacesAction } from './action';

const fields = [
  {
    name: 'name',
    type: 'name',
    placeholder: 'Nome',
    label: 'Nome',
  },
  {
    name: 'description',
    type: 'text',
    placeholder: 'Descrição',
    label: 'Descrição',
  },
  {
    name: 'capacity',
    type: 'number',
    placeholder: 'Capacidade',
    label: 'Capacidade',
  },
];

export default function SpaceFormPage() {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SpacesFormSchema>>({
    resolver: zodResolver(SpacesFormSchema),
    defaultValues: {
      name: '',
      capacity: 0,
      description: '',
      image: null,
    },
  });

  const handleSubmit = (values: z.infer<typeof SpacesFormSchema>) => {
    setError('');
    setSuccess('');

    startTransition(async () => {
      try {
        const result = await createdSpacesAction(values);

        if (!result) {
          setError('Ocorreu um erro no servidor, por favor, tente mais tarde');
          return;
        }

        setSuccess('Espaço criado com sucesso');
        return;
      } catch (error) {
        setError('Ocorreu um erro no servidor, por favor, tente mais tarde');
      }
    });
  };

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium bold text-rose-500 mb-6">
        Crie um novo espaço
      </h1>
      <Card>
        <CardContent className="mt-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <div className="space-y-6">
                {fields.map((field) => (
                  <FormField
                    key={field.name}
                    control={form.control}
                    name={field.name as 'name' | 'description' | 'capacity'}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel>{field.label}</FormLabel>
                        <FormControl>
                          <Input
                            {...formField}
                            disabled={isPending}
                            placeholder={field.placeholder}
                            type={field.type}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagem</FormLabel>
                      <FormControl>
                        <ImageUploader
                          onImageChange={(image) => field.onChange(image)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormError message={error} />
              <FormSuccess message={success} />
              <div className="flex flex-col md:flex-row gap-2">
                <Button
                  disabled={isPending}
                  type="submit"
                  className="flex-1 w-full"
                >
                  Criar espaço
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
}
