'use client';

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

import { columns } from '@/app/(app)/(protected)/admin/resource/column';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, MinusCircle, PlusCircle, Trash2 } from 'lucide-react';
import { getAllResources } from '@/lib/db/queries/resources';
import Link from 'next/link';
import {
  addOneResourceAction,
  deleteResourceAction,
  removeOneResourceAction,
} from './action';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';

export default function DataTableResourcePage() {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [data, setData] = useState<any[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      try {
        const result = await getAllResources();
        setData(result || []);
      } catch (error) {
        setData([]);
      }
    });
  }, []);

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

  const handleRemoveResource = (id: string) => {
    setError('');
    setSuccess('');

    startTransition(async () => {
      try {
        const result = await deleteResourceAction(id);

        if (!result) {
          return setError(
            'Esse recurso não pode ser excluído, pois possui reservas ativas',
          );
        }

        const updatedData = await getAllResources();
        setData(updatedData || []);

        setSuccess('Deletado com sucesso');
      } catch (error) {
        setError('Ocorreu um erro no servidor, por favor, tente mais tarde');
      }
    });
  };

  const handleAddOneResource = (id: string) => {
    setError('');
    setSuccess('');

    startTransition(async () => {
      try {
        const result = await addOneResourceAction(id);

        if (!result) {
          return setError(
            'Não foi possível adicionar uma unidade a este recurso',
          );
        }

        const updatedData = await getAllResources();
        setData(updatedData || []);

        setSuccess('Unidade adicionada com sucesso');
      } catch (error) {
        setError('Ocorreu um erro no servidor, por favor, tente mais tarde');
      }
    });
  };

  const handleRemoveOneResource = (id: string) => {
    setError('');
    setSuccess('');

    startTransition(async () => {
      try {
        const result = await removeOneResourceAction(id);

        if (!result) {
          return setError('Não foi possível remover uma unidade deste recurso');
        }

        const updatedData = await getAllResources();
        setData(updatedData || []);

        setSuccess('Unidade removida com sucesso');
      } catch (error) {
        setError('Ocorreu um erro no servidor, por favor, tente mais tarde');
      }
    });
  };

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium bold text-rose-500 mb-6">
        Recursos de Espaços
      </h1>
      <FormError message={error} />
      <FormSuccess message={success} />
      <div className="flex max-h-screen w-full m-auto gap-4">
        <div className="flex-auto">
          <div className="border dark:bg-slate-900 flex items-center justify-center">
            {isPending ? (
              <span className="flex">
                <Loader2 className="animate-spin" />
                Carregando
              </span>
            ) : (
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
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500"
                            onClick={() =>
                              handleRemoveResource(row.original.id)
                            }
                            disabled={isPending}
                          >
                            <Trash2 />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-500"
                            onClick={() =>
                              handleAddOneResource(row.original.id)
                            }
                            disabled={isPending}
                          >
                            <PlusCircle />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-orange-500"
                            onClick={() =>
                              handleRemoveOneResource(row.original.id)
                            }
                            disabled={isPending}
                          >
                            <MinusCircle />
                          </Button>
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
                </TableBody>
              </Table>
            )}
          </div>
          <div className="flex justify-between py-4">
            <div className="flex items-center space-x-2">
              <Link href={'/admin/resource/create'}>
                <Button
                  className="dark:bg-slate-900"
                  variant="outline"
                  size="sm"
                >
                  Criar
                </Button>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
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
      </div>
    </section>
  );
}
