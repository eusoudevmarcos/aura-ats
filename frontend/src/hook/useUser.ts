import { TipoUsuario } from '@/schemas/funcionario.schema';
import { useEffect, useState } from 'react';
import { ZodUUID } from 'zod';

interface User {
  uid: ZodUUID;
  email: string;
  tipo: TipoUsuario;
  nome: string;
  cpf: string;
  razaoSocial?: string;
}

export function useUser(): User {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/getUser')
      .then(res => res.json())
      .then((data: { user?: User; error?: any }) => {
        if (data.user) setUser(data.user);
        else setUser(null);
      })
      .catch(() => setUser(null));
  }, []);

  return user;
}
