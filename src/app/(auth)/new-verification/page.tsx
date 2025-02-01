'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { newVerificationAction } from '@/app/(auth)/actions';
import { FormSuccess } from '@/components/form-success';
import { FormError } from '@/components/form-error';

export default function NewVerificationPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [loading, setLoading] = useState(true);

  const handleVerificationToken = useCallback(async () => {
    if (success || error) return;

    if (!token) {
      setError('Token não encontrado!');
      setLoading(false);
      return;
    }

    try {
      const data = await newVerificationAction(token);

      setLoading(false);

      setError(data.error);
      setSuccess(data.success);
    } catch (error) {
      setError('Ocorreu um erro no servidor, por favor, tente novamente');
    }
  }, [token, success, error]);

  useEffect(() => {
    handleVerificationToken();
  }, [handleVerificationToken]);

  return (
    <section className="h-screen flex flex-col justify-center items-center">
      <Card className="w-full flex flex-col md:flex-row py-12 px-4 sm:px-6 lg:px-8 lg:min-w-[1040px] lg:h-[500px] max-w-[1080px] bg-slate-50">
        <CardHeader className="md:w-1/2">
          <CardTitle className="text-3xl md:text-5xl font-semibold tracking-tight">
            Verificação de Email
          </CardTitle>
        </CardHeader>
        <CardContent className="md:w-1/2">
          <div className="flex h-full w-full items-center justify-center">
            {loading && <div>Verificando seu Email...</div>}
            {!loading && success && <FormSuccess message={success} />}
            {!loading && error && <FormError message={error} />}
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
