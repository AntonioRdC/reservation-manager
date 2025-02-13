import { ColumnDef } from '@tanstack/react-table';

export const columnsSpaces: ColumnDef<{
  name: string;
  description: string | null;
  capacity: number;
}>[] = [
  { id: 'name', accessorKey: 'name', header: 'Nome' },
  {
    id: 'email',
    accessorKey: 'description',
    header: 'Email',
  },
  { id: 'capacity', accessorKey: 'capacity', header: 'Capacidade' },
];

export const columnsResources: ColumnDef<{ name: string; quantity: number }>[] =
  [
    { id: 'name', accessorKey: 'name', header: 'Nome' },
    { id: 'quantity', accessorKey: 'quantity', header: 'Quantidade' },
  ];
