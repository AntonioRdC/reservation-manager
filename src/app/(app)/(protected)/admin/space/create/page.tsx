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

export default function SpaceForm() {
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
        }

        setSuccess('Espaço criado com sucesso');
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
