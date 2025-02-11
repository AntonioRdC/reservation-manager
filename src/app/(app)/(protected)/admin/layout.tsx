import { redirect } from 'next/navigation';

import { currentUser } from '@/lib/auth/hooks/get-current-user';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (user?.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return <div>{children}</div>;
}
