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
import { ResourcesFormSchema } from './schema';
import { createResourcesAction } from './action';

const fields = [
  {
    name: 'name',
    type: 'name',
    placeholder: 'Nome',
    label: 'Nome',
  },
  {
    name: 'quantity',
    type: 'number',
    placeholder: 'Quintidade',
    label: 'Quintidade',
  },
];

export default function ResourceFormPage() {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ResourcesFormSchema>>({
    resolver: zodResolver(ResourcesFormSchema),
    defaultValues: {
      name: '',
      quantity: 0,
    },
  });

  const handleSubmit = (values: z.infer<typeof ResourcesFormSchema>) => {
    setError('');
    setSuccess('');

    startTransition(async () => {
      try {
        const result = await createResourcesAction(values);

        if (!result) {
          setError('Ocorreu um erro no servidor, por favor, tente mais tarde');
        }

        setSuccess('Recurso criado com sucesso');
      } catch (error) {
        setError('Ocorreu um erro no servidor, por favor, tente mais tarde');
      }
    });
  };

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium bold text-rose-500 mb-6">
        Crie um novo recurso
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
                    name={field.name as 'name' | 'quantity'}
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
              </div>
              <FormError message={error} />
              <FormSuccess message={success} />
              <div className="flex flex-col md:flex-row gap-2">
                <Button
                  disabled={isPending}
                  type="submit"
                  className="flex-1 w-full"
                >
                  Criar recurso
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
}
