import { redirect } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AccountForm } from '@/app/(app)/account/account-form';
import { currentUser } from '@/lib/auth/hooks/get-current-user';

export default async function AccountPage() {
  const user = await currentUser();

  if (!user) {
    redirect('/');
  }

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium text-rose-500 mb-6">
        Configuração da conta
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Informações da conta</CardTitle>
        </CardHeader>
        <CardContent>
          <AccountForm user={user} />
        </CardContent>
      </Card>
    </section>
  );
}
