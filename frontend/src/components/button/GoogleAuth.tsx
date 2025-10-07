'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { PrimaryButton } from './PrimaryButton';

export function ConnectGoogleButton() {
  const { data: session, status } = useSession();
  if (status === 'loading') {
    return <button disabled>Carregando...</button>;
  }

  if (session?.user) {
    const handleDisaconnectGoogle = () => {
      signOut();
    };

    return (
      <div className="mb-6">
        <p className="text-primary mb-0">Conta do Google conectada.</p>
        <span className="text-secondary text-sm">
          A agenda sera vinculada ao e-mail: {session.user.email}{' '}
          <button
            onClick={handleDisaconnectGoogle}
            className="text-red-500 underline"
          >
            sair
          </button>
        </span>
      </div>
    );
  }

  const handleConnectGoogle = () => {
    signIn('google', { callbackUrl: window.location.href });
  };

  return (
    <PrimaryButton onClick={handleConnectGoogle}>
      Conectar Google Agenda
    </PrimaryButton>
  );
}
