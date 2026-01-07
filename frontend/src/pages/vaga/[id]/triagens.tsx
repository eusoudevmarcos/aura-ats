import api from '@/axios';
import Card from '@/components/Card';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';

type Triagem = {
  id: string;
  ativa: boolean;
  tipoTriagem: string;
  create_at: string;
  update_at: string;
};

interface TriagensDaVagaPageProps {
  initialTriagens?: Triagem[];
  initialError?: string | null;
}

const TriagensDaVagaPage: React.FC<TriagensDaVagaPageProps> = ({
  initialTriagens,
  initialError,
}) => {
  const router = useRouter();
  const { id } = router.query;

  const [triagens, setTriagens] = useState<Triagem[]>(initialTriagens || []);
  const [loading, setLoading] = useState(!initialTriagens);
  const [error, setError] = useState<string | null>(initialError || null);

  const fetchTriagens = useCallback(async () => {
    if (!id || typeof id !== 'string') return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/api/externalWithAuth/triagem`, {
        params: { vagaId: id },
      });
      const payload = res.data?.data || res.data?.items || res.data; // tolerante
      setTriagens(payload || []);
    } catch (e) {
      setError('Erro ao carregar triagens.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // Só busca se não tiver dados iniciais do SSR
    if (!initialTriagens) {
      fetchTriagens();
    }
  }, [fetchTriagens, initialTriagens]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          className="px-4 py-2 bg-primary text-white rounded shadow-md hover:scale-105 transition-transform"
          onClick={() => router.back()}
        >
          Voltar
        </button>
        <h1 className="text-2xl font-bold text-primary">Triagens da Vaga</h1>
        <div />
      </div>

      {loading && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        </div>
      )}

      {error && <div className="text-center text-red-600 mb-4">{error}</div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-4">
          {triagens.length === 0 && (
            <div className="text-center text-gray-600">
              Nenhuma triagem encontrada.
            </div>
          )}
          {triagens.map(t => (
            <Card key={t.id}>
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 rounded-full font-semibold bg-[#ede9fe] text-primary">
                    {t.tipoTriagem?.replaceAll('_', ' ')}
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      t.ativa ? 'text-green-700' : 'text-gray-500'
                    }`}
                  >
                    {t.ativa ? 'ATIVA' : 'INATIVA'}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  Criada em: {new Date(t.create_at).toLocaleString('pt-BR')}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TriagensDaVagaPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;

  try {
    // Criar instância de API para servidor
    const serverApi = axios.create({
      baseURL: process.env.NEXT_PUBLIC_NEXT_URL || 'http://localhost:3000',
      withCredentials: true,
      headers: context.req.headers.cookie
        ? { Cookie: context.req.headers.cookie }
        : {},
    });

    const res = await serverApi.get(`/api/externalWithAuth/triagem`, {
      params: { vagaId: id },
    });

    const payload = res.data?.data || res.data?.items || res.data || [];

    return {
      props: {
        initialTriagens: payload,
        initialError: null,
      },
    };
  } catch (error) {
    return {
      props: {
        initialTriagens: [],
        initialError: 'Erro ao carregar triagens.',
      },
    };
  }
};
