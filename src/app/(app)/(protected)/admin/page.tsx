import { Metadata } from 'next';

import { DataTableAdmin } from '@/app/(app)/(protected)/admin/components/admin-data-table';

export default async function AdminPage() {
  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium bold text-rose-500 mb-6">
        Tabela de requisições das reservas
      </h1>

      <DataTableAdmin />
    </section>
  );
}
