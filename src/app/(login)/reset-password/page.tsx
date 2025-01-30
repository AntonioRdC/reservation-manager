import { Login } from '@/app/(login)/login';
import { ResetPasswordFormSchema } from '@/app/(login)/schema';
import { resetPasswordAction } from '@/app/(login)/actions';

export default function RestPasswordPage() {
  return (
    <Login
      mode="resetPassword"
      title="Trocar senha"
      description="Enviaremos um e-mail para trocar sua senha"
      onSubmit={resetPasswordAction}
      schema={ResetPasswordFormSchema}
      fields={[
        { name: 'email', type: 'email', placeholder: 'Email', label: 'Email' },
      ]}
      auxLink={{ text: 'Fazer login', href: '/sign-in' }}
      submitText="Enviar E-mail"
    />
  );
}
