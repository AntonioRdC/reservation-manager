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
import { useState } from 'react';

import {
  cancelledBooking,
  confirmedBooking,
} from '@/app/(app)/(protected)/admin/reservation/actions';

import { columns } from '@/app/(app)/(protected)/admin/reservation/components/columns';
import {
  BookingData,
  Booking,
} from '@/app/(app)/(protected)/admin/reservation/types';
import { useCurrentUser } from '@/lib/auth/hooks/use-current-user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import Link from 'next/link';

interface DataTableProps {
  data: BookingData[];
}

export function DataTableReservation({ data: initialData }: DataTableProps) {
  const user = useCurrentUser();

  const [data, setData] = useState(initialData);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

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

  const updateBookingStatus = (updatedBooking: Booking) => {
    setData((prevData) =>
      prevData.map((item) => {
        return item.booking.id === updatedBooking.id
          ? { ...item, booking: updatedBooking }
          : item;
      }),
    );
  };

  const handleConfirmed = async (booking: Booking) => {
    const updatedBooking = await confirmedBooking(user, booking.id);
    updateBookingStatus(updatedBooking!);
  };

  const handleCancel = async (booking: Booking) => {
    const updatedBooking = await cancelledBooking(user, booking.id);
    updateBookingStatus(updatedBooking!);
  };

  return (
    <div className="flex max-h-screen w-full m-auto gap-4">
      <div className="flex-auto">
        <div className="border dark:bg-slate-900">
          <div className="flex items-center py-4 mx-4">
            <Input
              placeholder="Filtrar por email"
              value={
                (table.getColumn('email')?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table.getColumn('email')?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          </div>
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
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/reservation/${row.original.booking.id}`}
                            >
                              Ver detalhes
                            </Link>
                          </DropdownMenuItem>
                          {row.original.booking.status === 'REQUESTED' && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  handleConfirmed(row.original.booking)
                                }
                              >
                                Aprovar agendamento
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleCancel(row.original.booking)
                                }
                              >
                                Cancelar agendamento
                              </DropdownMenuItem>
                            </>
                          )}
                          {row.original.booking.status === 'CONFIRMED' && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  handleCancel(row.original.booking)
                                }
                              >
                                Cancelar agendamento
                              </DropdownMenuItem>
                            </>
                          )}
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
