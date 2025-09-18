import api from '@/axios';
import Card from '@/components/Card';
import { useUser } from '@/context/AuthContext';
import React, { useEffect, useState } from 'react';

interface Pessoa {
  nome: string;
  cpf: string;
  rg: string;
  dataNascimento: string;
  createdAt: string;
  updatedAt: string;
}

interface Funcionario {
  setor: string;
  cargo: string;
}

interface UserData {
  email: string;
  tipoUsuario: string;
  pessoa?: Pessoa;
  funcionario?: Funcionario;
}

const UserPage: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const user = useUser();

  useEffect(() => {
    if (user?.uid) {
      const fetchUser = async () => {
        setLoading(true);
        setErro(null);
        try {
          const resp = await api.get('/api/external/funcionario/' + user.uid);

          if (resp.status === 200) {
            setUserData(resp.data);
          } else {
            setErro('Usuário não encontrado.');
          }
        } catch (error: any) {
          setErro('Erro ao buscar usuário: ' + error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [user]);

  if (loading) {
    return <div>Carregando dados do usuário...</div>;
  }

  if (erro) {
    return <div style={{ color: 'red' }}>{erro}</div>;
  }

  if (!userData) {
    return <div>Nenhum dado encontrado para este usuário.</div>;
  }

  return (
    <div className="bg-gray-50 p-6 space-y-6">
      <h1 className="text-[#8c53ff] font-bold text-2xl mb-6">
        Perfil do Usuário
      </h1>

      {/* Sessão de Dados do Usuário */}
      <Card>
        <h2 className="text-lg font-semibold mb-2 text-gray-700">
          Dados do Usuário
        </h2>
        <ul className="list-none p-0 space-y-1">
          <li>
            <strong>Email:</strong> {userData.email}
          </li>
          <li>
            <strong>Tipo de Usuário:</strong> {userData.tipoUsuario}
          </li>
        </ul>
      </Card>

      {/* Sessão Pessoa */}
      {userData.pessoa && (
        <Card>
          <h2 className="text-lg font-semibold mb-2 text-gray-700">
            Dados Pessoais
          </h2>
          <ul className="list-none p-0 space-y-1">
            <li>
              <strong>Nome:</strong> {userData.pessoa.nome}
            </li>
            <li>
              <strong>CPF:</strong> {userData.pessoa.cpf}
            </li>
            <li>
              <strong>RG:</strong> {userData.pessoa.rg}
            </li>
            <li>
              <strong>Data de Nascimento:</strong>{' '}
              {userData.pessoa.dataNascimento}
            </li>
            <li>
              <strong>Criado em:</strong> {userData.pessoa.createdAt}
            </li>
            <li>
              <strong>Atualizado em:</strong> {userData.pessoa.updatedAt}
            </li>
          </ul>
        </Card>
      )}

      {/* Sessão Funcionário */}
      {userData.funcionario && (
        <Card>
          <h2 className="text-lg font-semibold mb-2 text-gray-700">
            Dados do Funcionário
          </h2>
          <ul className="list-none p-0 space-y-1">
            <li>
              <strong>Setor:</strong> {userData.funcionario.setor}
            </li>
            <li>
              <strong>Cargo:</strong> {userData.funcionario.cargo}
            </li>
          </ul>
        </Card>
      )}
    </div>
  );
};

export default UserPage;
