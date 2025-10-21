import { Tarefa, tarefaApi } from '@/axios/tarefaApi';
import Card from '@/components/Card';
import AtividadeLayout from '@/layout/AtividadesLayout';
import { useEffect, useState } from 'react';

// Corrigindo: o nome do componente deve começar com letra maiúscula
export default function Tarefas() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTarefas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTarefas = async () => {
    try {
      setLoading(true);
      const tarefasData = await tarefaApi.getAll();
      setTarefas(tarefasData);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    } finally {
      setLoading(false);
    }
  };

  function renderMultiline(text: string) {
    return text.split('\n').map((line, idx) => (
      <span key={idx}>
        {line}
        {idx !== text.split('\n').length - 1 && <br />}
      </span>
    ));
  }

  return (
    <AtividadeLayout>
      <Card title={{ label: 'Tarefas', className: 'text-2xl' }}>
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Visualização das suas tarefas. Para gerenciar tarefas, acesse a
            página principal de Tarefas.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Carregando tarefas...</p>
          </div>
        ) : tarefas.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhuma tarefa encontrada.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {tarefas.map(tarefa => (
              <li
                key={tarefa.id}
                className={`flex items-center p-3 rounded-lg border bg-white shadow ${
                  tarefa.concluida ? 'opacity-50 line-through' : ''
                }`}
              >
                <div className="flex items-center mr-3">
                  <div
                    className={`rounded-full border-2 aspect-square w-6 h-6 flex items-center justify-center ${
                      tarefa.concluida
                        ? 'border-primary bg-primary text-white'
                        : 'border-primary/40 text-primary'
                    }`}
                  >
                    {tarefa.concluida && (
                      <span className="material-icons-outlined w-4 h-4">
                        check
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <span
                    className={`text-gray-700 whitespace-pre-line ${
                      tarefa.concluida ? 'line-through' : ''
                    }`}
                    style={{ whiteSpace: 'pre-line' }}
                  >
                    {renderMultiline(tarefa.descricao)}
                  </span>
                  <div className="text-xs text-gray-500 mt-1">
                    Criada em:{' '}
                    {new Date(tarefa.createdAt!).toLocaleDateString('pt-BR')}
                    {tarefa.updatedAt &&
                      tarefa.updatedAt !== tarefa.createdAt && (
                        <span>
                          {' '}
                          • Atualizada em:{' '}
                          {new Date(tarefa.updatedAt).toLocaleDateString(
                            'pt-BR'
                          )}
                        </span>
                      )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </AtividadeLayout>
  );
}
