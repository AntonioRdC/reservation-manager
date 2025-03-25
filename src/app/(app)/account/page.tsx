import { redirect } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AccountForm } from '@/app/(app)/account/account-form';
import { currentUser } from '@/lib/auth/hooks/get-current-user';
import { getUserById } from '@/lib/db/queries/users';

export default async function AccountPage() {
  const sessionUser = await currentUser();

  if (!sessionUser?.id) {
    redirect('/');
  }

  const user = await getUserById(sessionUser.id);

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
          <AccountForm user={user} sessionUser={sessionUser} />
        </CardContent>
      </Card>
    </section>
  );
}
