import { Login } from '@/app/(login)/login';
import { SignUpFormSchema } from '@/app/(login)/schema';
import { signUpAction } from '@/app/(login)/actions';

export default function SignUpPage() {
  return (
    <Login
      mode="signUp"
      title="Criar Conta"
      description="Cadastre-se para acessar"
      onSubmit={signUpAction}
      schema={SignUpFormSchema}
      fields={[
        { name: 'name', type: 'text', placeholder: 'Nome', label: 'Nome' },
        { name: 'email', type: 'email', placeholder: 'Email', label: 'Email' },
        {
          name: 'password',
          type: 'password',
          placeholder: 'Senha',
          label: 'Senha',
        },
      ]}
      auxLink={{ text: 'Fazer login', href: '/sign-in' }}
      submitText="Criar conta"
    />
  );
}
