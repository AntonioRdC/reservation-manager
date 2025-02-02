import { redirect } from 'next/navigation';

import { DeleteAccountForm } from '@/app/(app)/account/security/delete-account-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PasswordForm } from '@/app/(app)/account/security/password-form';
import { currentUser } from '@/lib/auth/hooks/get-current-user';

export default async function SecurityPage() {
  const user = await currentUser();

  if (!user) {
    redirect('/');
  }

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium bold text-gray-900 mb-6">
        Configurações de Segurança
      </h1>
      {!user.isOAuth && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Senha</CardTitle>
          </CardHeader>
          <CardContent>
            <PasswordForm user={user} />
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Deletar conta</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            A exclusão da conta não é reversível. Por favor, proceda com
            cautela.
          </p>
          <DeleteAccountForm user={user} />
        </CardContent>
      </Card>
    </section>
  );
}
