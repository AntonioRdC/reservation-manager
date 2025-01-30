'use client';

import * as z from 'zod';
import { FaGoogle } from 'react-icons/fa';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
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
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { signInGoogleAction } from '@/app/(login)/actions';
import { useSearchParams } from 'next/navigation';

export interface AuthFormProps {
  title: string;
  description: string;
  schema?: any;
  onSubmit?: any;
  fields?: Array<{
    name: string;
    type: string;
    placeholder: string;
    label: string;
    link?: {
      text: string;
      href: string;
    };
  }>;
  auxLink?: {
    text: string;
    href: string;
  };
  submitText?: string;
  mode?:
    | 'signIn'
    | 'signUp'
    | 'resetPassword'
    | 'newPassword'
    | 'newVerification';
  successMessage?: string;
  errorMessage?: string;
}

export function Login({
  title,
  description,
  fields,
  schema,
  onSubmit,
  submitText,
  mode,
  auxLink,
  successMessage,
  errorMessage,
}: AuthFormProps) {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const callbackUrl = searchParams.get('callbackUrl');

  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [loading, setLoading] = useState(true);

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  });

  const onClick = (provider: 'google') => {
    signInGoogleAction(provider);
  };

  const handleSubmit = (values: z.infer<typeof schema>) => {
    setError('');
    setSuccess('');

    startTransition(async () => {
      try {
        const data = onSubmit(values, token);

        form.reset();

        setError(data.error);
        setSuccess(data.success);
      } catch (error) {
        setError('Ocorreu um erro no servidor, por favor, tente novamente');
      }
    });
  };

  const handleVerificationToken = useCallback(async () => {
    if (success || error) return;

    if (!token) {
      setError('Token não encontrado!');
      setLoading(false);
      return;
    }

    try {
      const data = await onSubmit(token);

      setLoading(false);
      setError(data.error);
      setSuccess(data.success);
    } catch (error) {
      setError('Ocorreu um erro no servidor, por favor, tente novamente');
    }
  }, [token, success, error]);

  useEffect(() => {
    if (mode === 'newVerification') {
      handleVerificationToken();
    }
  }, [handleVerificationToken]);

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <Card className="w-full flex flex-col md:flex-row py-12 px-4 sm:px-6 lg:px-8 lg:min-w-[1040px] lg:h-[500px] max-w-[1080px] bg-slate-50">
        <CardHeader className="md:w-1/2">
          <CardTitle className="text-3xl md:text-5xl font-semibold tracking-tight">
            {title}
          </CardTitle>
          <CardDescription className="text-base font-semibold">
            {description}
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
                        name={field.name}
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
                  <FormError message={errorMessage} />
                  <FormSuccess message={successMessage} />
                  <div className="flex flex-col md:flex-row gap-2">
                    {auxLink && (
                      <Link href={auxLink.href} className="flex-1">
                        <Button variant="secondary" className="w-full">
                          {auxLink.text}
                        </Button>
                      </Link>
                    )}
                    <Button
                      disabled={isPending}
                      type="submit"
                      className="flex-1 w-full"
                    >
                      {submitText}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
            {mode === 'signIn' && (
              <>
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
              </>
            )}
          </div>
          {mode === 'newVerification' && (
            <div className="flex h-full w-full items-center justify-center">
              {loading && <div>Verificando seu Email...</div>}
              {!loading && success && <FormSuccess message={success} />}
              {!loading && error && <FormError message={error} />}
            </div>
          )}
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
