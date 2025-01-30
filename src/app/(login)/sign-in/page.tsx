import { Login } from '@/app/(login)/login';
import { SignInFormSchema } from '@/app/(login)/schema';
import { signInAction } from '@/app/(login)/actions';

export default function SignInPage() {
  return (
    <Login
      mode="signIn"
      title="Fazer Login"
      description="Insira seu e-mail e senha abaixo para fazer login na sua conta"
      onSubmit={signInAction}
      schema={SignInFormSchema}
      fields={[
        { name: 'email', type: 'email', placeholder: 'Email', label: 'Email' },
        {
          name: 'password',
          type: 'password',
          placeholder: 'Senha',
          label: 'Senha',
          link: { text: 'Esqueceu a senha?', href: '/reset-password' },
        },
      ]}
      auxLink={{ text: 'Criar conta', href: '/sign-up' }}
      submitText="Entrar"
    />
  );
}
