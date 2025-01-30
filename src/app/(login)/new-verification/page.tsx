import { newVerificationAction } from '@/app/(login)/actions';
import { Login } from '@/app/(login)/login';

export default function NewVerificationPage() {
  return (
    <Login
      mode="newVerification"
      title="Verificação de Email"
      onSubmit={newVerificationAction}
      description=""
    />
  );
}
