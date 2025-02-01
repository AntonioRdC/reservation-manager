'use client';

import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ErrorPage() {
  return (
    <section className="h-screen flex flex-col justify-center items-center">
      <Card className="w-full flex flex-col md:flex-row py-12 px-4 sm:px-6 lg:px-8 lg:min-w-[1040px] lg:h-[500px] max-w-[1080px] bg-slate-50">
        <CardHeader className="md:w-1/2">
          <CardTitle className="text-3xl md:text-5xl font-semibold tracking-tight">
            Algo deu errado
          </CardTitle>
        </CardHeader>
        <CardContent className="md:w-1/2">
          <Link href="/sign-in" className="flex-1">
            <Button variant="outline" className="w-full">
              Voltar ao login
            </Button>
          </Link>
          <div className="flex justify-center items-center h-full w-full gap-6">
            <ExclamationTriangleIcon className="text-destructive" />
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
