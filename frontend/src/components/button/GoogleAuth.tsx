'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { PrimaryButton } from './PrimaryButton';

export function ConnectGoogleButton() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <button disabled>Carregando...</button>;
  }

  if (session?.user) {
    return <p>Conta do Google conectada.</p>;
  }

  const handleConnectGoogle = () => {
    signIn('google', { callbackUrl: window.location.href });
  };

  return (
    <PrimaryButton onClick={handleConnectGoogle}>
      Conectar Google Calendar
    </PrimaryButton>
  );
}
