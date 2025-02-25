import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<{ name: string; quantity: number }>[] = [
  { id: 'name', accessorKey: 'name', header: 'Nome' },
  { id: 'quantity', accessorKey: 'quantity', header: 'Quantidade' },
];
