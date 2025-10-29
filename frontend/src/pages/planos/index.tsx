import React, { useEffect, useState } from 'react';

interface Plano {
  id: string | number;
  nome: string;
  preco: string;
  descricao?: string;
  beneficios?: string[];
  [key: string]: any;
}

const PlanosPage: React.FC = () => {
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function fetchPlanos() {
      try {
        const resp = await fetch('/api/externalWithAuth/planos');
        if (!resp.ok) throw new Error('Erro ao buscar planos');
        const data = await resp.json();
        if (!ignore) setPlanos(data.data);
      } catch (err: any) {
        if (!ignore) setErro(err?.message || 'Erro ao buscar planos');
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchPlanos();
    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span>Carregando planos...</span>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-red-600 text-lg">{erro}</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-10">
        Planos disponíveis
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {planos && planos.length > 0 ? (
          planos.map(plano => (
            <div
              key={plano.id}
              className="bg-white rounded-xl shadow-lg p-8 flex flex-col gap-4 border border-violet-100"
            >
              <h2 className="text-2xl font-semibold text-violet-700">
                {plano.nome}
              </h2>
              {plano.descricao ? (
                <p className="text-gray-700">{plano.descricao}</p>
              ) : null}
              <div className="text-xl font-bold text-violet-900 mb-2">
                R$ {plano.preco}
              </div>
              {plano.beneficios && plano.beneficios.length > 0 && (
                <ul className="list-disc pl-6 text-gray-700">
                  {plano.beneficios.map((b: string, idx: number) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-600">
            Nenhum plano disponível no momento.
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanosPage;
