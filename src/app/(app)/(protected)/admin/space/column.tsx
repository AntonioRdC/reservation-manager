import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<{
  name: string;
  description: string | null;
  capacity: number;
}>[] = [
  { id: 'name', accessorKey: 'name', header: 'Nome' },
  {
    id: 'descrição',
    accessorKey: 'description',
    header: 'Descrição',
  },
  { id: 'capacity', accessorKey: 'capacity', header: 'Capacidade' },
];
