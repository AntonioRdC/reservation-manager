'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import * as z from 'zod';

import { SignUpFormSchema } from '@/app/(auth)/schema';
import { FormSuccess } from '@/components/form-success';
import { signUpAction } from '@/app/(auth)/actions';
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
  { name: 'name', type: 'text', placeholder: 'Nome', label: 'Nome' },
  {
    name: 'email',
    type: 'email',
    placeholder: 'Email',
    label: 'Email',
  },
  {
    name: 'password',
    type: 'password',
    placeholder: 'Senha',
    label: 'Senha',
  },
];

export default function SignUpPage() {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SignUpFormSchema>>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const handleSubmit = (values: z.infer<typeof SignUpFormSchema>) => {
    setError('');
    setSuccess('');

    startTransition(async () => {
      try {
        const data = await signUpAction(values);

        form.reset();

        setError(data.error);
        setSuccess(data.success);
      } catch (error) {
        setError('Ocorreu um erro no servidor, por favor, tente novamente');
      }
    });
  };

  return (
    <section className="h-screen flex flex-col justify-center items-center">
      <Card className="w-full flex flex-col md:flex-row py-12 px-4 sm:px-6 lg:px-8 lg:min-w-[1040px] lg:h-[500px] max-w-[1080px] bg-slate-50">
        <CardHeader className="md:w-1/2">
          <CardTitle className="text-3xl md:text-5xl font-semibold tracking-tight">
            Criar Conta
          </CardTitle>
          <CardDescription className="text-base font-semibold">
            Cadastre-se para acessar
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
                      name={field.name as 'email' | 'password' | 'name'}
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
                    Criar conta
                  </Button>
                  <Link href="/sign-in" className="flex-1">
                    <Button variant="outline" className="w-full">
                      Fazer login
                    </Button>
                  </Link>
                </div>
              </form>
            </Form>
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
    </section>
  );
}
