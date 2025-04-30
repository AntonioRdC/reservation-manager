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
import { useTransition, useState, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { UpdateAccountFormSchema } from '@/app/(app)/account/schema';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { ExtendedUser } from '@/lib/auth/next-auth';
import { Separator } from '@/components/ui/separator';
import { User } from '@/lib/db/schema';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ImageUploader } from '../(reservation)/reservation/components/image-uploader';

type FormField = {
  name: keyof z.infer<typeof UpdateAccountFormSchema>;
  type: string;
  placeholder: string;
  label: string;
  section?: string;
};

const fields: FormField[] = [
  {
    name: 'name',
    type: 'text',
    placeholder: 'Nome',
    label: 'Nome',
    section: 'basic',
  },
  {
    name: 'email',
    type: 'email',
    placeholder: 'Email',
    label: 'Email',
    section: 'basic',
  },

  {
    name: 'telefone',
    type: 'tel',
    placeholder: '(00) 00000-0000',
    label: 'Telefone',
    section: 'contact',
  },
];

const ESTADOS_BRASILEIROS = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' },
];

function formatPhoneNumber(value: string) {
  if (!value) return '';

  const onlyNums = value.replace(/\D/g, '');

  if (onlyNums.length === 0) {
    return '';
  } else if (onlyNums.length <= 2) {
    return `(${onlyNums}`;
  } else if (onlyNums.length <= 7) {
    return `(${onlyNums.slice(0, 2)}) ${onlyNums.slice(2)}`;
  } else {
    return `(${onlyNums.slice(0, 2)}) ${onlyNums.slice(2, 7)}-${onlyNums.slice(7, 11)}`;
  }
}

function formatCEP(value: string) {
  if (!value) return '';

  // Remove todos os caracteres não numéricos
  const onlyNums = value.replace(/\D/g, '');

  // Formata o CEP
  if (onlyNums.length <= 5) {
    return onlyNums;
  } else {
    return `${onlyNums.slice(0, 5)}-${onlyNums.slice(5, 8)}`;
  }
}

export function AccountForm({
  user,
  sessionUser,
}: {
  user: User;
  sessionUser: ExtendedUser;
}) {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof UpdateAccountFormSchema>>({
    resolver: zodResolver(UpdateAccountFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      telefone: user?.telefone || '',
      address: user?.address || '',
      city: user?.city || '',
      state: user?.state || '',
      zipCode: user?.zipCode || '',
      country: user?.country || 'Brasil',
      image: user?.image || null,
    },
  });

  const handleSubmit = (values: z.infer<typeof UpdateAccountFormSchema>) => {
    setError('');
    setSuccess('');

    startTransition(async () => {
      try {
        const data = await updateAccountAction(values);

        if (data.data) {
          form.reset(data.data);
        }

        setError(data.error);
        setSuccess(data.success);
      } catch (error) {
        setError('Ocorreu um erro no servidor, por favor, tente novamente');
      }
    });
  };

  const basicFields = fields.filter((field) => field.section === 'basic');
  const contactFields = fields.filter((field) => field.section === 'contact');

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
        {/* Imagem */}
        <div className="flex space-y-4 gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={user?.image || undefined}
              alt={user?.name || 'Foto de perfil'}
            />
            <AvatarFallback className="text-xl font-semibold text-gray-900">
              {user?.name?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>

          <FormField
            key={'image'}
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
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
        </div>

        {/* Campos básicos */}
        <div className="space-y-4">
          {basicFields.map((field) => (
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
                        isPending ||
                        (sessionUser?.isOAuth && field.name === 'email')
                      }
                      placeholder={field.placeholder}
                      type={field.type}
                      value={
                        typeof formField.value === 'string'
                          ? formField.value
                          : ''
                      }
                    />
                  </FormControl>
                  {sessionUser?.isOAuth && field.name === 'email' && (
                    <p className="text-sm text-gray-500">
                      Você não pode alterar o email ao usar login social.
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        {/* Informações de contato */}
        <div className="space-y-4">
          <Separator className="my-4" />
          <h3 className="font-medium text-lg">Informações de Contato</h3>

          {contactFields.map((field) => (
            <FormField
              key={field.name}
              control={form.control}
              name={field.name}
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>{field.label}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={field.placeholder}
                      type="tel"
                      disabled={isPending}
                      value={
                        typeof formField.value === 'string'
                          ? formField.value
                          : ''
                      }
                      onChange={(e) => {
                        const input = e.target.value.replace(/\D/g, '');

                        if (input.length <= 11) {
                          formField.onChange(formatPhoneNumber(input));
                        }
                      }}
                      onBlur={formField.onBlur}
                      ref={formField.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        {/* Informações de endereço */}
        <div className="space-y-4">
          <Separator className="my-4" />
          <h3 className="font-medium text-lg">Endereço</h3>

          {/* Endereço completo */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="Rua, número, complemento"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cidade e estado em grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Cidade"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Estado</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-full justify-between',
                            !field.value && 'text-muted-foreground',
                          )}
                          disabled={isPending}
                        >
                          {field.value
                            ? ESTADOS_BRASILEIROS.find(
                                (estado) => estado.sigla === field.value,
                              )?.nome || field.value
                            : 'Selecione um estado'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Buscar estado..." />
                        <CommandEmpty>Nenhum estado encontrado.</CommandEmpty>
                        <CommandGroup className="max-h-60 overflow-y-auto">
                          {ESTADOS_BRASILEIROS.map((estado) => (
                            <CommandItem
                              key={estado.sigla}
                              value={estado.sigla}
                              onSelect={() => {
                                field.onChange(estado.sigla);
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  field.value === estado.sigla
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                              {estado.sigla} - {estado.nome}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* CEP e país em grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="00000-000"
                      disabled={isPending}
                      value={field.value || ''}
                      onChange={(e) => {
                        const input = e.target.value.replace(/\D/g, '');

                        if (input.length <= 8) {
                          field.onChange(formatCEP(input));
                        }
                      }}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>País</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} placeholder="País" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormError message={error} />
        <FormSuccess message={success} />

        <Button
          type="submit"
          className="bg-rose-500 hover:bg-rose-600 text-white w-full sm:w-auto"
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
