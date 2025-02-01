import { currentUser } from '@/lib/auth/hooks/get-current-user';
import { redirect } from 'next/navigation';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (user) {
    redirect('/dashboard');
  }

  return <main>{children}</main>;
}
