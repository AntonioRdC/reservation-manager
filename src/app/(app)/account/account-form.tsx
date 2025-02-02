'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { updateAccountAction } from '@/app/(app)/account/actions';
import { useTransition, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { UpdateAccountFormSchema } from '@/app/(app)/account/schema';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { ExtendedUser } from '@/lib/auth/next-auth';

type FormField = {
  name: keyof z.infer<typeof UpdateAccountFormSchema>;
  type: string;
  placeholder: string;
  label: string;
};

const fields: FormField[] = [
  { name: 'name', type: 'text', placeholder: 'Nome', label: 'Nome' },
  { name: 'email', type: 'email', placeholder: 'Email', label: 'Email' },
];

export function AccountForm({ user }: { user: ExtendedUser }) {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof UpdateAccountFormSchema>>({
    resolver: zodResolver(UpdateAccountFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const handleSubmit = (values: z.infer<typeof UpdateAccountFormSchema>) => {
    setError('');
    setSuccess('');

    startTransition(async () => {
      try {
        const data = await updateAccountAction(values);

        form.reset(data.data);

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
                      disabled={
                        isPending || (user?.isOAuth && field.name === 'email')
                      }
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
            <>Salvar alterações</>
          )}
        </Button>
      </form>
    </Form>
  );
}
