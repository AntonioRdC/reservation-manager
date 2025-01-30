import { NewPasswordFormSchema } from '@/app/(login)/schema';
import { newPasswordAction } from '@/app/(login)/actions';
import { Login } from '@/app/(login)/login';

export default function NewPasswordPage() {
  return (
    <Login
      mode="resetPassword"
      title="Trocar senha"
      description="Digite sua nova senha"
      onSubmit={newPasswordAction}
      schema={NewPasswordFormSchema}
      fields={[
        {
          name: 'password',
          type: 'password',
          placeholder: 'Senha',
          label: 'Senha',
        },
      ]}
      auxLink={{ text: 'Fazer login', href: '/sign-in' }}
      submitText="Atualizar senha"
    />
  );
}
