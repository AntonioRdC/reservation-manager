'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useCurrentUser } from '@/lib/auth/hooks/use-current-user';
import { updateAccountAction } from '@/app/(app)/dashboard/actions';
import { useTransition, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { UpdateAccountFormSchema } from '../schema';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';

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

export default function GeneralPage() {
  const user = useCurrentUser();

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

        form.reset();

        setError(data.error);
        setSuccess(data.success);
      } catch (error) {
        setError('Ocorreu um erro no servidor, por favor, tente novamente');
      }
    });
  };

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium text-gray-900 mb-6">
        General Settings
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit(handleSubmit)}
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
                className="bg-orange-500 hover:bg-orange-600 text-white"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Alterações salvas'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
}
