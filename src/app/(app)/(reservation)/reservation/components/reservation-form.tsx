'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Resource, Space } from '@/lib/db/schema';
import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Image from 'next/image';

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
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

  // Estado para armazenar o espaço selecionado
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);

  const form = useForm<z.infer<typeof ReservationFormSchema>>({
    resolver: zodResolver(ReservationFormSchema),
    defaultValues: {
      space: '',
      category: 'CONSULTANCY',
      date: new Date(),
      startTime: '06:00 AM',
      endTime: '10:00 PM',
      resources: [],
    },
  });

  // Observe mudanças no campo "space" do formulário
  useEffect(() => {
    const spaceId = form.watch('space');
    if (spaceId) {
      const space = spaces.find((s) => s.id === spaceId);
      setSelectedSpace(space || null);
    } else {
      setSelectedSpace(null);
    }
  }, [form.watch('space'), spaces]);

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

        {/* Mostrar detalhes do espaço selecionado */}
        {selectedSpace && (
          <Card className="mt-4 overflow-hidden">
            <div className="relative w-full h-48">
              {selectedSpace.image ? (
                <Image
                  src={selectedSpace.image}
                  alt={selectedSpace.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-t-md"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">Sem imagem disponível</p>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">{selectedSpace.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedSpace.description || 'Sem descrição'}
                  </p>
                </div>
                <Badge variant="outline" className="ml-2">
                  Capacidade: {selectedSpace.capacity}
                </Badge>
              </div>

              {/* Mostrar endereço se disponível */}
              {selectedSpace.address && (
                <div className="mt-4 text-sm">
                  <p className="font-medium">Endereço:</p>
                  <p>{selectedSpace.address}</p>
                  <p>
                    {selectedSpace.city}, {selectedSpace.state} -{' '}
                    {selectedSpace.zipCode}
                  </p>
                  <p>{selectedSpace.country}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

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

        {/* Resto do formulário... */}
        {/* ... */}

        <FormError message={error} />
        <FormSuccess message={success} />
        <Button disabled={isPending} type="submit" className="w-full">
          Fazer Agendamento
        </Button>
      </form>
    </Form>
  );
}
