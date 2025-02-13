'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Resource, Space } from '@/lib/db/schema';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { createBookingAction } from '@/app/(app)/(reservation)/reservation/action';

import { CategorySelector } from '@/app/(app)/(reservation)/reservation/components/category-selector';
import { ResourceSelector } from '@/app/(app)/(reservation)/reservation/components/resource-selector';
import { DateTimePicker } from '@/app/(app)/(reservation)/reservation/components/date-time-picker';
import { ImageUploader } from '@/app/(app)/(reservation)/reservation/components/image-uploader';
import { ReservationFormSchema } from '@/app/(app)/(reservation)/reservation/schema';
import { categoryType } from '@/app/(app)/(reservation)/reservation/docs';
import { FormSuccess } from '@/components/form-success';
import { Separator } from '@/components/ui/separator';
import { FormError } from '@/components/form-error';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

interface BookingFormProps {
  spaces: Space[];
  resources: Resource[];
}

export function ReservationForm({ spaces, resources }: BookingFormProps) {
  const router = useRouter();

  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ReservationFormSchema>>({
    resolver: zodResolver(ReservationFormSchema),
    defaultValues: {
      space: '',
      category: 'CONSULTANCY',
      date: new Date(),
      startTime: '06:00 AM',
      endTime: '10:00 PM',
      resources: [],
      image: undefined,
    },
  });

  const handleSubmit = async (
    values: z.infer<typeof ReservationFormSchema>,
  ) => {
    setError('');
    setSuccess('');

    startTransition(async () => {
      try {
        const data = await createBookingAction(values);

        if (data.success) {
          router.push('/dashboard');
        }

        if (data.error) {
          setError(data.error);
        }
      } catch (error) {
        setError('Ocorreu um erro no servidor, por favor, tente novamente');
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Espaço */}
        <FormField
          control={form.control}
          name="space"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipos de espaço</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha um espaço" />
                  </SelectTrigger>
                  <SelectContent>
                    {spaces.map((space) => (
                      <SelectItem key={space.id} value={space.id}>
                        {space.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        {/* Categoria */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <FormControl>
                <CategorySelector
                  categories={categoryType}
                  selectedCategory={field.value}
                  onSelectedCategory={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        {/* Data e horário */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Horário do agendamento</FormLabel>
              <FormControl>
                <DateTimePicker
                  selectedDate={field.value}
                  onSelectDate={field.onChange}
                  selectedStartTime={form.getValues('startTime')}
                  onSelectStartTime={(value) =>
                    form.setValue('startTime', value)
                  }
                  selectedEndTime={form.getValues('endTime')}
                  onSelectEndTime={(value) => form.setValue('endTime', value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        {/* Recursos */}
        <FormField
          control={form.control}
          name="resources"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recursos</FormLabel>
              <FormControl>
                <ResourceSelector
                  resources={resources}
                  onResourcesChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        {/* Upload de Imagem */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imagem</FormLabel>
              <FormControl>
                <ImageUploader
                  onImageChange={(image) => field.onChange(image)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormError message={error} />
        <FormSuccess message={success} />
        <Button disabled={isPending} type="submit" className="w-full">
          Fazer Agendamento
        </Button>
      </form>
    </Form>
  );
}
