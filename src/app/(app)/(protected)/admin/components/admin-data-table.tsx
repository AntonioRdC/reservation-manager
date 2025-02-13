'use client';

import { GiHamburgerMenu } from 'react-icons/gi';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
} from '@tanstack/react-table';
import { useEffect, useState, useTransition } from 'react';
import { getAllSpaces } from '@/lib/db/queries/spaces';
import { getAllResources } from '@/lib/db/queries/resources';

import {
  columnsResources,
  columnsSpaces,
} from '@/app/(app)/(protected)/admin/components/columns';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { SpacesFormSchema, ResourcesFormSchema } from '../schema';
import { createdResourcesAction, createdSpacesAction } from '../action';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const fieldsSpaces = [
  {
    name: 'name',
    type: 'name',
    placeholder: 'Nome',
    label: 'Nome',
  },
  {
    name: 'description',
    type: 'text',
    placeholder: 'Descrição',
    label: 'Descrição',
  },
  {
    name: 'capacity',
    type: 'number',
    placeholder: 'Capacidade',
    label: 'Capacidade',
  },
];

const fieldsResources = [
  {
    name: 'name',
    type: 'name',
    placeholder: 'Nome',
    label: 'Nome',
  },
  {
    name: 'quantity',
    type: 'number',
    placeholder: 'Quintidade',
    label: 'Quintidade',
  },
];

export function DataTableAdmin() {
  const [selectedType, setSelectedType] = useState<'spaces' | 'resources'>(
    'spaces',
  );
  const [data, setData] = useState<any[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newRowData, setNewRowData] = useState<any>({});
  const [errors, setErrors] = useState<string[] | undefined>([]);
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const columns = selectedType === 'spaces' ? columnsSpaces : columnsResources;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result =
          selectedType === 'spaces'
            ? await getAllSpaces()
            : await getAllResources();
        setData(result!);
      } catch (error) {
        setData([]);
      }
    };

    fetchData();
  }, [selectedType]);

  const formSpace = useForm<z.infer<typeof SpacesFormSchema>>({
    resolver: zodResolver(SpacesFormSchema),
    defaultValues: {
      name: '',
      capacity: 0,
      description: '',
    },
  });

  const formResource = useForm<z.infer<typeof ResourcesFormSchema>>({
    resolver: zodResolver(ResourcesFormSchema),
    defaultValues: {
      name: '',
      quantity: 0,
    },
  });

  const handleAddNew = () => {
    setIsAddingNew(true);
    setNewRowData({});
  };

  const handleCancelNew = () => {
    setIsAddingNew(false);
    setNewRowData({});
  };

  const handleSubmitSpace = (values: z.infer<typeof SpacesFormSchema>) => {
    const result = createdSpacesAction(values);

    if (!result) {
      setErrors(['Ocorreu um erro no servidor, por favor, tente mais tarde']);
    }

    setSuccess('Item criado');
    setIsAddingNew(false);
    setData([...data, values]);
    return;
  };

  const handleSubmitResource = (
    values: z.infer<typeof ResourcesFormSchema>,
  ) => {
    const result = createdResourcesAction(values);

    if (!result) {
      setErrors(['Ocorreu um erro no servidor, por favor, tente mais tarde']);
    }

    setSuccess('Item criado');
    setIsAddingNew(false);
    setData([...data, values]);
    return;
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnFilters,
      sorting,
    },
  });

  return (
    <div className="flex max-h-screen w-full m-auto gap-4">
      <div className="flex-auto">
        <div className="flex gap-4 mb-4">
          <Button
            variant={selectedType === 'spaces' ? 'default' : 'outline'}
            onClick={() => setSelectedType('spaces')}
          >
            Espaços
          </Button>
          <Button
            variant={selectedType === 'resources' ? 'default' : 'outline'}
            onClick={() => setSelectedType('resources')}
          >
            Recursos
          </Button>
          <Button onClick={handleAddNew}>
            Criar {selectedType === 'spaces' ? 'Espaço' : 'Recurso'}
          </Button>
        </div>
        <div className="border dark:bg-slate-900">
          <FormSuccess message={success} />
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                  <TableHead>Ações</TableHead>
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir ações</span>
                            <GiHamburgerMenu />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            Editar{' '}
                            {selectedType === 'spaces' ? 'Espaço' : 'Recurso'}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Excluir{' '}
                            {selectedType === 'spaces' ? 'Espaço' : 'Recurso'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    className="h-24 text-center"
                  >
                    Sem resultados
                  </TableCell>
                </TableRow>
              )}
              {isAddingNew && (
                <TableRow key="new-row">
                  {selectedType === 'spaces' ? (
                    <>
                      {fieldsSpaces.map((field) => (
                        <TableCell key={field.name}>
                          <Form {...formSpace}>
                            <form
                              onSubmit={formSpace.handleSubmit(
                                handleSubmitSpace,
                              )}
                            >
                              <FormField
                                key={field.name}
                                control={formSpace.control}
                                name={
                                  field.name as
                                    | 'name'
                                    | 'description'
                                    | 'capacity'
                                }
                                render={({ field: formField }) => (
                                  <FormItem>
                                    <FormLabel />
                                    <FormControl>
                                      <Input
                                        {...formField}
                                        disabled={isPending}
                                        placeholder={field.placeholder}
                                        type={field.type}
                                      />
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </form>
                          </Form>
                        </TableCell>
                      ))}
                      <TableCell>
                        <Button
                          disabled={isPending}
                          type="submit"
                          className="flex-1 w-full bg-rose-500 hover:bg-rose-600"
                          onClick={formSpace.handleSubmit(handleSubmitSpace)}
                        >
                          Salvar
                        </Button>
                        <Button variant="outline" onClick={handleCancelNew}>
                          Cancelar
                        </Button>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      {fieldsResources.map((field) => (
                        <TableCell key={field.name}>
                          <Form {...formResource}>
                            <form
                              onSubmit={formResource.handleSubmit(
                                handleSubmitResource,
                              )}
                            >
                              <FormField
                                key={field.name}
                                control={formResource.control}
                                name={field.name as 'name' | 'quantity'}
                                render={({ field: formField }) => (
                                  <FormItem>
                                    <FormLabel />
                                    <FormControl>
                                      <Input
                                        {...formField}
                                        disabled={isPending}
                                        placeholder={field.placeholder}
                                        type={field.type}
                                      />
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </form>
                          </Form>
                        </TableCell>
                      ))}
                      <TableCell>
                        <Button
                          disabled={isPending}
                          type="submit"
                          className="flex-1 w-full bg-rose-500 hover:bg-rose-600"
                          onClick={formResource.handleSubmit(
                            handleSubmitResource,
                          )}
                        >
                          Salvar
                        </Button>
                        <Button variant="outline" onClick={handleCancelNew}>
                          Cancelar
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex gap-2">
            {errors?.map((error) => <FormError key={error} message={error} />)}
          </div>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            className="dark:bg-slate-900"
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            className="dark:bg-slate-900"
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
