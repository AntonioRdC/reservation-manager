import { ColumnDef } from '@tanstack/react-table';
import { Resource, Space } from '@/lib/db/schema';

export const columnsSpaces: ColumnDef<Space>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
  },
  {
    id: 'email',
    accessorKey: 'description',
    header: 'Email',
  },
  {
    accessorKey: 'capacity',
    header: 'Capacidade',
  },
];

export const columnsResources: ColumnDef<Resource>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
  },
  {
    accessorKey: 'quantity',
    header: 'Quantidade',
  },
];
