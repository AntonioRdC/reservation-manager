'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition, useState } from 'react';
import { Lock, Loader2 } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { DeleteAccountFormSchema } from '@/app/(app)/account/schema';
import { FormSuccess } from '@/components/form-success';
import { ExtendedUser } from '@/lib/auth/next-auth';
import { FormError } from '@/components/form-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  deleteAccountAction,
  deleteAccountGoogleAction,
} from '@/app/(app)/account/actions';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

type FormField = {
  name: keyof z.infer<typeof DeleteAccountFormSchema>;
  type: string;
  placeholder: string;
  label: string;
};

const fields: FormField[] = [
  {
    name: 'password',
    type: 'password',
    placeholder: 'Senha',
    label: 'Senha',
  },
];

export function DeleteAccountForm({ user }: { user: ExtendedUser }) {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof DeleteAccountFormSchema>>({
    resolver: zodResolver(DeleteAccountFormSchema),
    defaultValues: {
      password: '',
    },
  });

  const handleSubmit = (values: z.infer<typeof DeleteAccountFormSchema>) => {
    setError('');
    setSuccess('');

    startTransition(async () => {
      try {
        const data = await deleteAccountAction(values, user);

        if (data?.error) {
          form.reset();

          setError(data?.error);
          return;
        }

        signOut({ redirectTo: '/' });
      } catch (error) {
        setError('Ocorreu um erro no servidor, por favor, tente novamente');
      }
    });
  };

  const handleOnClick = () => {
    setError('');
    setSuccess('');

    startTransition(async () => {
      try {
        await deleteAccountGoogleAction(user);

        signOut({ redirectTo: '/' });
      } catch (error) {
        setError('Ocorreu um erro no servidor, por favor, tente novamente');
      }
    });
  };

  if (user.isOAuth)
    return (
      <div className="space-y-6">
        <FormError message={error} />
        <FormSuccess message={success} />
        <Button
          type="submit"
          className="bg-rose-500 hover:bg-rose-600 text-white"
          onClick={handleOnClick}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deletando...
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Deletar conta
            </>
          )}
        </Button>
      </div>
    );

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
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
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
        <FormError message={error} />
        <FormSuccess message={success} />
        <Button
          type="submit"
          className="bg-rose-500 hover:bg-rose-600 text-white"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deletando...
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Deletar conta
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
