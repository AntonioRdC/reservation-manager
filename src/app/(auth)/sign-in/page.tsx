'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { FaGoogle } from 'react-icons/fa';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import * as z from 'zod';

import { DEFAULT_LOGIN_REDIRECT } from '@/lib/auth/routes';
import { FormSuccess } from '@/components/form-success';
import { SignInFormSchema } from '@/app/(auth)/schema';
import { signInAction } from '@/app/(auth)/actions';
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
    link: { text: 'Esqueceu a senha?', href: '/reset-password' },
  },
];

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SignInFormSchema>>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onClick = (provider: 'google') => {
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  };

  const handleSubmit = (values: z.infer<typeof SignInFormSchema>) => {
    setError('');
    setSuccess('');

    startTransition(async () => {
      const validatedCredentials = await signInAction(values);
      if (validatedCredentials.error || validatedCredentials.success) {
        setSuccess(validatedCredentials.success);
        setError(validatedCredentials.error);
        form.reset();
        return;
      }

      try {
        await signIn('credentials', {
          email: validatedCredentials.email,
          password: validatedCredentials.password,
          redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
        });
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
                      name={field.name as 'email' | 'password'}
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
                          {field.link && (
                            <Button
                              size="sm"
                              variant="link"
                              asChild
                              className="px-0 font-normal"
                            >
                              <Link href={field.link.href}>
                                {field.link.text}
                              </Link>
                            </Button>
                          )}
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
                    Entrar
                  </Button>
                  <Link href={'/sign-up'} className="flex-1">
                    <Button variant="outline" className="w-full">
                      Criar conta
                    </Button>
                  </Link>
                </div>
              </form>
            </Form>
            <div className="relative mx-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Ou continue com
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              type="button"
              className="mx-1"
              onClick={() => onClick('google')}
            >
              <FaGoogle className="mr-2 h-4 w-4" />
              Google
            </Button>
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
