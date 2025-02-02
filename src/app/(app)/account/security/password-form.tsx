'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition, useState } from 'react';
import { Lock, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { UpdatePasswordFormSchema } from '@/app/(app)/account/schema';
import { updatePasswordAction } from '@/app/(app)/account/actions';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FormSuccess } from '@/components/form-success';
import { ExtendedUser } from '@/lib/auth/next-auth';
import { FormError } from '@/components/form-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type FormField = {
  name: keyof z.infer<typeof UpdatePasswordFormSchema>;
  type: string;
  placeholder: string;
  label: string;
};

const fields: FormField[] = [
  {
    name: 'currentPassword',
    type: 'password',
    placeholder: 'Senha atual',
    label: 'Senha atual',
  },
  {
    name: 'newPassword',
    type: 'password',
    placeholder: 'Nova senha',
    label: 'Nova senha',
  },
  {
    name: 'confirmPassword',
    type: 'password',
    placeholder: 'Confirmar senha',
    label: 'Confirmar senha',
  },
];

export function PasswordForm({ user }: { user: ExtendedUser }) {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof UpdatePasswordFormSchema>>({
    resolver: zodResolver(UpdatePasswordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleSubmit = (values: z.infer<typeof UpdatePasswordFormSchema>) => {
    setError('');
    setSuccess('');

    startTransition(async () => {
      try {
        const data = await updatePasswordAction(values, user?.email!);

        form.reset();

        setError(data.error);
        setSuccess(data.success);
      } catch (error) {
        setError('Ocorreu um erro no servidor, por favor, tente novamente');
      }
    });
  };

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
              Salvando...
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Alterar senha
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
