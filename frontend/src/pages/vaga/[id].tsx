// pages/vaga/[uuid].tsx
import api from '@/axios'; // Certifique-se que o caminho está correto
import Card from '@/components/card'; // Certifique-se que o caminho está correto
import VagaForm from '@/components/form/VagaForm';
import { EditPenIcon, TrashIcon } from '@/components/icons'; // Certifique-se que o caminho está correto
import Modal from '@/components/modal/Modal'; // Certifique-se que o caminho está correto
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

// Importe as novas tipagens de vaga
// import {
//   VagaWithAllRelations,
//   CategoriaVaga,
//   StatusVaga,
//   TipoContrato,
//   NivelExperiencia,
//   AreaCandidato,
// } from "@/types/vaga.type"; // Ajuste o caminho para onde você salvou vaga.type.ts

// Importe o formulário de Vaga se existir, caso contrário, use um placeholder.
// import VagaForm from "@/components/form/VagaForm"; // Descomente e ajuste o caminho se você tiver um VagaForm

const VagaPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query; // 'uuid' será o ID da vaga

  const [vaga, setVaga] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModalEdit, setShowModalEdit] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchVaga = async () => {
      setLoading(true);
      setError(null);
      try {
        // Altere o endpoint para buscar detalhes da vaga
        const res = await api.get(`/api/external/vaga/${id}`);
        setVaga(res.data);
      } catch (_) {
        setError('Vaga não encontrada ou erro ao buscar dados.');
        setVaga(null);
      } finally {
        setLoading(false);
      }
    };

    fetchVaga();
  }, [id]);

  const handleDelete = async () => {
    if (!vaga) return;
    if (confirm('Tem certeza que deseja excluir esta vaga?')) {
      try {
        // Altere o endpoint para deletar vaga
        await api.delete(`/api/vaga/${vaga.id}`);
        router.push('/vagas'); // Redireciona para a lista de vagas
      } catch {
        alert('Erro ao excluir vaga.');
      }
    }
  };

  const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: string | Date | null | undefined): string => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-4 text-primary text-lg">Carregando...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <span className="text-red-600 text-xl font-semibold mb-4">{error}</span>
      </div>
    );
  }

  if (!vaga) return null;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <section className="bg-white p-4 rounded-2xl shadow-md">
        <div className="flex justify-between items-center mb-8">
          <button
            className="px-4 py-2 bg-primary text-white rounded shadow-md hover:scale-105 transition-transform"
            onClick={() => router.back()}
          >
            Voltar
          </button>
          <h1 className="text-2xl font-bold text-center text-primary flex-grow">
            Detalhes da Vaga
          </h1>
          <div className="flex gap-2">
            <button
              className="px-3 py-2 bg-[#5f82f3] text-white rounded shadow-md hover:scale-110 transition-transform"
              onClick={() => setShowModalEdit(true)}
            >
              <EditPenIcon />
            </button>
            <button
              className="px-3 py-2 bg-[#f72929] text-white rounded shadow-md hover:scale-110 transition-transform"
              onClick={handleDelete}
            >
              <TrashIcon />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informações Principais da Vaga */}
          <Card
            classNameContainer="col-span-full"
            classNameContent="gap-2 flex flex-col"
          >
            <h1 className="font-black text-xl">{vaga.titulo}</h1>
            <div>
              <span className="font-medium">Descrição:</span>
              <span className="ml-2">{vaga.descricao}</span>
            </div>
            {vaga.requisitos && (
              <div>
                <span className="font-medium">Requisitos:</span>
                <span className="ml-2">{vaga.requisitos}</span>
              </div>
            )}
            {vaga.responsabilidades && (
              <div>
                <span className="font-medium">Responsabilidades:</span>
                <span className="ml-2">{vaga.responsabilidades}</span>
              </div>
            )}
            <div>
              <span className="font-medium">Salário:</span>
              <span className="ml-2">
                {formatCurrency(vaga.salario)}
                {vaga.tipoSalario && `(${vaga.tipoSalario})`}
              </span>
            </div>
            <div>
              <span className="font-medium">Data Publicação:</span>
              <span className="ml-2">{formatDate(vaga.dataPublicacao)}</span>
            </div>
            {vaga.dataFechamento && (
              <div>
                <span className="font-medium">Data Fechamento:</span>
                <span className="ml-2">{formatDate(vaga.dataFechamento)}</span>
              </div>
            )}
            <section className="flex justify-between">
              <div>
                <span className="font-medium mr-2">Categoria:</span>
                <span className="bg-[#ede9fe] text-primary text-xs font-semibold px-3 py-1 rounded-full border border-secondary">
                  {vaga.categoria}
                </span>
              </div>
              <div>
                <span className="font-medium mr-2">Status:</span>
                <span className="bg-[#ede9fe] text-primary text-xs font-semibold px-3 py-1 rounded-full border border-secondary">
                  {vaga.status}
                </span>
              </div>
              <div>
                <span className="font-medium mr-2">Tipo Contrato:</span>
                <span className="bg-[#ede9fe] text-primary text-xs font-semibold px-3 py-1 rounded-full border border-secondary">
                  {vaga.tipoContrato}
                </span>
              </div>
              <div>
                <span className="font-medium mr-2">Nível Experiência:</span>
                <span className="bg-[#ede9fe] text-primary text-xs font-semibold px-3 py-1 rounded-full border border-secondary">
                  {vaga.nivelExperiencia}
                </span>
              </div>
              {vaga.areaCandidato && (
                <div>
                  <span className="font-medium mr-2">Área Candidato:</span>
                  <span className="bg-[#ede9fe] text-primary text-xs font-semibold px-3 py-1 rounded-full border border-secondary">
                    {vaga.areaCandidato}
                  </span>
                </div>
              )}
            </section>
          </Card>

          {/* Dados do Cliente */}
          {vaga.cliente && (
            <Card title="Dados do Cliente">
              <div>
                <span className="font-medium">Titulo:</span>
                <span className="ml-2">{vaga.cliente.titulo}</span>
              </div>
              {/* Adicione outros campos do cliente aqui se houver */}
            </Card>
          )}

          {/* Dados da Localização */}
          {vaga.localizacao && (
            <Card
              title="Localização da Vaga"
              classNameContainer="col-span-full"
            >
              <div>
                <span className="font-medium">Endereço:</span>
                <span className="ml-2">
                  {vaga.localizacao.logradouro
                    ? `${vaga.localizacao.logradouro}, `
                    : ''}
                  {vaga.localizacao.bairro
                    ? `${vaga.localizacao.bairro}, `
                    : ''}
                  {vaga.localizacao.cidade} - {vaga.localizacao.uf}
                </span>
              </div>
              {vaga.localizacao.cep && (
                <div>
                  <span className="font-medium">CEP:</span>
                  <span className="ml-2">{vaga.localizacao.cep}</span>
                </div>
              )}
              {vaga.localizacao.complemento && (
                <div>
                  <span className="font-medium">Complemento:</span>
                  <span className="ml-2">{vaga.localizacao.complemento}</span>
                </div>
              )}
              {vaga.localizacao.regiao && (
                <div>
                  <span className="font-medium">Região:</span>
                  <span className="ml-2">{vaga.localizacao.regiao}</span>
                </div>
              )}
            </Card>
          )}

          {/* Benefícios */}
          {vaga.beneficios && vaga.beneficios.length > 0 && (
            <Card title="Benefícios Oferecidos">
              {vaga.beneficios.map((beneficio: any) => (
                <div key={beneficio.id} className="mb-2">
                  <span className="font-medium">
                    {beneficio.nome || 'N/A'}:
                  </span>
                  <span className="ml-2">{beneficio.descricao || 'N/A'}</span>
                </div>
              ))}
            </Card>
          )}

          {/* Habilidades */}
          {vaga.habilidades && vaga.habilidades.length > 0 && (
            <Card title="Habilidades Exigidas">
              {vaga.habilidades.map((vh: any) => (
                <div key={vh.habilidadeId} className="mb-2">
                  <span>{vh.nivelExigido || 'Não especificado'}</span>-
                  <span>{vh.habilidade.nome || 'Não especificado'}</span>-
                  <span>
                    {vh.habilidade.tipoHabilidade || 'Não especificado'}
                  </span>
                </div>
              ))}
            </Card>
          )}

          {/* Anexos */}
          {vaga.anexos && vaga.anexos.length > 0 && (
            <Card title="Anexos da Vaga">
              {vaga.anexos.map((va: any) => (
                <div key={va.anexoId} className="mb-2">
                  <a
                    href={va.anexo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {va.anexo.nomeArquivo}
                  </a>
                  {va.anexo.tipo && (
                    <span className="text-sm text-gray-500">
                      ({va.anexo.tipo})
                    </span>
                  )}
                </div>
              ))}
            </Card>
          )}
        </div>
      </section>

      {/* Modal de Edição (Placeholder) */}
      <Modal
        isOpen={showModalEdit}
        onClose={() => setShowModalEdit(false)}
        title="Editar Vaga"
      >
        <VagaForm
          onSuccess={() => {
            setShowModalEdit(false);
          }}
          initialValues={vaga}
        />
        <p>Formulário de edição da vaga viria aqui.</p>
      </Modal>
    </div>
  );
};

export default VagaPage;
