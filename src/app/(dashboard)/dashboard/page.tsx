import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth/hooks/get-current-user';

export default async function SettingsPage() {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  return <></>;
}
