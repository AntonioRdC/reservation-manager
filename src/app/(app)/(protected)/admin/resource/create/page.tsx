'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { FormSuccess } from '@/components/form-success';
import { FormError } from '@/components/form-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ResourcesFormSchema } from './schema';
import { ImageUploader } from '@/app/(app)/(reservation)/reservation/components/image-uploader';
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

export default function ResourceForm() {
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
    <section className="h-screen flex flex-col justify-center items-center">
      <Card className="w-full flex flex-col md:flex-row py-12 px-4 sm:px-6 lg:px-8 lg:min-w-[1040px] lg:h-[500px] max-w-[1080px] bg-slate-50">
        <CardHeader className="md:w-1/2">
          <CardTitle className="text-3xl md:text-5xl font-semibold tracking-tight">
            Fazer Login
          </CardTitle>
          <CardDescription className="text-base font-semibold">
            Insira seu e-mail e senha abaixo para fazer login na sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="md:w-1/2">
          <div className="grid gap-6">
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
                    className="flex-1 w-full bg-rose-500 hover:bg-rose-600"
                  >
                    Criar espaço
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
