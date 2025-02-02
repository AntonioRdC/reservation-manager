'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import * as z from 'zod';

import { NewPasswordFormSchema } from '@/app/(auth)/schema';
import { newPasswordAction } from '@/app/(auth)/actions';
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

const fields = [
  {
    name: 'password',
    type: 'password',
    placeholder: 'Senha',
    label: 'Senha',
  },
];

export default function NewPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof NewPasswordFormSchema>>({
    resolver: zodResolver(NewPasswordFormSchema),
    defaultValues: {
      password: '',
    },
  });

  const handleSubmit = (values: z.infer<typeof NewPasswordFormSchema>) => {
    setError('');
    setSuccess('');

    startTransition(async () => {
      try {
        const data = await newPasswordAction(values, token);

        form.reset();

        setError(data.error);
        setSuccess(data.success);
      } catch (error) {
        setError('Ocorreu um erro no servidor, por favor, tente novamente');
      }
    });
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <Card className="w-full flex flex-col md:flex-row py-12 px-4 sm:px-6 lg:px-8 lg:min-w-[1040px] lg:h-[500px] max-w-[1080px] bg-slate-50">
        <CardHeader className="md:w-1/2">
          <CardTitle className="text-3xl md:text-5xl font-semibold tracking-tight">
            Trocar senha
          </CardTitle>
          <CardDescription className="text-base font-semibold">
            Digite sua nova senha
          </CardDescription>
        </CardHeader>
        <CardContent className="md:w-1/2">
          <div className="grid gap-6">
            {fields && (
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
                        name={field.name as 'password'}
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
                    <Link href="/sign-in" className="flex-1">
                      <Button variant="outline" className="w-full">
                        Fazer login
                      </Button>
                    </Link>
                    <Button
                      disabled={isPending}
                      type="submit"
                      className="flex-1 w-full bg-rose-500 hover:bg-rose-600"
                    >
                      Atualizar senha
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </div>
        </CardContent>
      </Card>
      <p className="pt-4 text-center text-sm text-muted-foreground">
        Ao clicar em Fazer Login, você concorda com nossos{' '}
        <Link
          href="/terms"
          className="underline underline-offset-4 hover:text-primary"
        >
          Termos de Serviço
        </Link>{' '}
        e{' '}
        <Link
          href="/privacy"
          className="underline underline-offset-4 hover:text-primary"
        >
          Política de Privacidade
        </Link>
        .
      </p>
    </div>
  );
}
