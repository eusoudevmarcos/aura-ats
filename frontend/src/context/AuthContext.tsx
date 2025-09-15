import { TipoUsuario } from '@/schemas/funcionario.schema';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ZodUUID } from 'zod';

interface User {
  uid: ZodUUID;
  email: string;
  tipo: TipoUsuario;
  nome: string;
  cpf: string;
  razaoSocial?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/getUser')
      .then(res => res.json())
      .then((data: { user?: User; error?: any }) => {
        if (data.user) setUser(data.user);
        else setUser(null);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return ctx;
}

export function useUser(): User | null {
  const { user } = useAuth();
  return user;
}

export const onLogout = () => {
  fetch('/api/logout', { method: 'POST' }).then(() => {
    location.reload();
  });
};
