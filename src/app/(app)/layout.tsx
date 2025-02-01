import { currentUser } from '@/lib/auth/hooks/get-current-user';
import { redirect } from 'next/navigation';
import { UserPage } from '@/app/(app)/user-page';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect('/');
  }

  return (
    <section className="flex flex-col min-h-screen">
      <UserPage children={children} user={user} />
    </section>
  );
}
