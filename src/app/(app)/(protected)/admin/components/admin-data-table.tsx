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
import { useEffect, useState } from 'react';
import { getAllSpaces } from '@/lib/db/queries/spaces';
import { getAllResources } from '@/lib/db/queries/resources';

import {
  columnsResources,
  columnsSpaces,
} from '@/app/(app)/(protected)/admin/components/columns';
import { useCurrentUser } from '@/lib/auth/hooks/use-current-user';
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

export function DataTableAdmin() {
  const [selectedType, setSelectedType] = useState<'spaces' | 'resources'>(
    'spaces',
  );
  const [data, setData] = useState<any[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

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
        </div>
        <div className="border dark:bg-slate-900">
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
            </TableBody>
          </Table>
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
