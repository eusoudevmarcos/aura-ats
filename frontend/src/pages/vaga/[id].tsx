// pages/vaga/[uuid].tsx
import api from '@/axios'; // Certifique-se que o caminho está correto
import { AdminGuard } from '@/components/auth/AdminGuard';
import { PrimaryButton } from '@/components/button/PrimaryButton';
import Card from '@/components/Card'; // Certifique-se que o caminho está correto
import CandidatoForm from '@/components/form/CandidatoForm';
import VagaForm from '@/components/form/VagaForm';
import { LabelStatus } from '@/components/global/label/LabelStatus';
import { EditPenIcon, TrashIcon } from '@/components/icons'; // Certifique-se que o caminho está correto
import Modal from '@/components/modal/Modal'; // Certifique-se que o caminho está correto
import ModalConfirmation from '@/components/modal/ModalConfirmation';
import ModalDelete from '@/components/modal/ModalDelete';
import CandidatoSearch from '@/components/search/CandidatoSearch';
import Tabs from '@/components/utils/Tabs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const VagaPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query; // 'uuid' será o ID da vaga

  const [vaga, setVaga] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalCandidato, setShowModalCandidato] = useState(false);
  const [showModalConfirmationDelete, setShowModalConfirmationDelete] =
    useState(false);
  const [showModalDeleteSucess, setShowModalDeleteSucess] = useState(false);
  const [currentTab, setCurrentTab] = useState('');

  const fetchVaga = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/api/external/vaga/${id}`);
      res.data.tipoSalario = res.data.tipoSalario.toUpperCase();
      setVaga(res.data);
    } catch (_) {
      setError('Vaga não encontrada ou erro ao buscar dados.');
      setVaga(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    fetchVaga();
  }, [id]);

  const handleDelete = async () => {
    if (!vaga) return;
    try {
      await api.delete(`/api/externalWithAuth/vaga/${vaga.id}`);
      setShowModalDeleteSucess(prev => !prev);
    } catch (error) {
      console.log(error);
      alert('Erro ao excluir vaga.');
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
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center text-primary grow">VAGA</h1>

      <div className="flex justify-between items-center mb-8">
        <button
          className="px-4 py-2 bg-primary text-white rounded shadow-md hover:scale-105 transition-transform"
          onClick={() => router.back()}
        >
          Voltar
        </button>

        <div className="flex gap-2">
          {/* TRIAGEM COMENTADA */}
          {/* <Link
            href={`/vaga/${vaga.id}/triagens`}
            className="px-4 py-2 bg-primary text-white rounded shadow-md hover:scale-105 transition-transform"
          >
            Triagem <span className="material-icons-outlined"></span>
          </Link> */}

          <AdminGuard>
            <button
              className="px-3 py-2 bg-[#5f82f3] text-white rounded shadow-md hover:scale-110 transition-transform"
              onClick={() => setShowModalEdit(true)}
            >
              <EditPenIcon />
            </button>
            <button
              className="px-3 py-2 bg-[#f72929] text-white rounded shadow-md hover:scale-110 transition-transform"
              onClick={() => setShowModalConfirmationDelete(prev => !prev)}
            >
              <TrashIcon />
            </button>
          </AdminGuard>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Informações Principais da Vaga */}
        <Card
          classNameContainer="col-span-full"
          classNameContent="flex flex-col"
        >
          <h1 className="font-black text-xl text-center">{vaga.titulo}</h1>

          <LabelStatus status={vaga.status}></LabelStatus>

          <div className="flex items-center">
            <span className="font-medium text-primary">Tipo Salário:</span>
            <p className="ml-2 text-secondary inline-block">
              {vaga.tipoSalario && vaga.tipoSalario}
            </p>
          </div>

          {vaga?.salario && (
            <div className="flex items-center">
              <span className="font-medium text-primary">Salário:</span>
              <p className="ml-2 text-secondary inline-block">
                R$ {vaga.salario}
              </p>
            </div>
          )}
          <div className="flex items-center">
            <span className="font-medium text-primary">Data Publicação:</span>
            <p className="ml-2 text-secondary inline-block">
              {vaga.dataPublicacao}
            </p>
          </div>
          {vaga.dataFechamento && (
            <div className="flex">
              <span className="font-medium text-primary">Data Fechamento:</span>
              <p className="ml-2 text-secondary inline-block">
                {vaga.dataFechamento}
              </p>
            </div>
          )}

          <div className="flex flex-col">
            <span className="font-medium text-primary">Descrição:</span>
            <p className="ml-2 text-secondary inline-block">{vaga.descricao}</p>
          </div>
          {vaga.requisitos && (
            <div className="flex flex-col">
              <span className="font-medium text-primary">Requisitos:</span>
              <p className="ml-2 text-secondary inline-block">
                {vaga.requisitos}
              </p>
            </div>
          )}
          {vaga.responsabilidades && (
            <div className="flex flex-col">
              <span className="font-medium text-primary">
                Responsabilidades:
              </span>
              <p className="ml-2 text-secondary inline-block">
                {vaga.responsabilidades}
              </p>
            </div>
          )}
          <section className="flex gap-2 md:gap-6 mt-4 flex-wrap">
            <div className="flex items-center">
              <span className="font-medium mr-2 text-primary">Categoria:</span>
              <p className="bg-[#ede9fe] text-primary text-xs font-semibold px-3 py-1 rounded-full text-secondary inline-block m-0">
                {vaga.categoria}
              </p>
            </div>

            {vaga.tipoContrato && (
              <div className="flex items-center">
                <span className="font-medium mr-2 text-primary">
                  Tipo Contrato:
                </span>
                <p className="bg-[#ede9fe] text-primary text-xs font-semibold px-3 py-1 rounded-full border border-secondary text-secondary inline-block m-0">
                  {vaga.tipoContrato}
                </p>
              </div>
            )}

            {vaga.nivelExperiencia && (
              <div className="flex items-center">
                <span className="font-medium mr-2 text-primary">
                  Nível Experiência:
                </span>
                <p className="bg-[#ede9fe] text-primary text-xs font-semibold px-3 py-1 rounded-full border border-secondary text-secondary inline-block m-0">
                  {vaga.nivelExperiencia}
                </p>
              </div>
            )}

            {vaga.areaCandidato && (
              <div className="flex items-center">
                <span className="font-medium mr-2 text-primary">
                  Área Candidato:
                </span>
                <p className="bg-[#ede9fe] text-primary text-xs font-semibold px-3 py-1 rounded-full border border-secondary text-secondary inline-block m-0">
                  {vaga.areaCandidato}
                </p>
              </div>
            )}
          </section>
        </Card>

        {vaga?.cliente?.empresa && (
          <Card title="Dados do Cliente">
            <div className="flex items-center">
              <span className="font-medium text-primary">CNPJ:</span>

              <p className="ml-2 text-secondary inline-block">
                {vaga.cliente.empresa.cnpj}
              </p>

              <Link
                href={`/cliente/${vaga.cliente.id}`}
                className="bg-primary hover:scale-110 rounded flex ml-2"
              >
                <span className="material-icons-outlined text-white">
                  search
                </span>
              </Link>
            </div>

            <div className="flex items-center">
              <span className="font-medium text-primary">Razão Social:</span>
              <p className="ml-2 text-secondary inline-block">
                {vaga.cliente.empresa.razaoSocial}
              </p>
            </div>

            <div className="flex items-center">
              <span className="font-medium text-primary">Nome Fantasia:</span>
              <p className="ml-2 text-secondary inline-block">
                {vaga.cliente.empresa.nomeFantasia}
              </p>
            </div>
          </Card>
        )}

        {vaga.localizacao && (
          <Card title="Localização da Vaga">
            <div className="flex items-center">
              <span className="font-medium text-primary">Endereço:</span>
              <p className="ml-2 text-secondary inline-block">
                {vaga.localizacao.logradouro
                  ? `${vaga.localizacao.logradouro}, `
                  : ''}
                {vaga.localizacao.bairro ? `${vaga.localizacao.bairro}, ` : ''}
                {vaga.localizacao.cidade} - {vaga.localizacao.uf}
              </p>
            </div>

            {vaga.localizacao.cep && (
              <div className="flex items-center">
                <span className="font-medium text-primary">CEP:</span>
                <p className="ml-2 text-secondary inline-block">
                  {vaga.localizacao.cep}
                </p>
              </div>
            )}

            {vaga.localizacao.complemento && (
              <div className="flex items-center">
                <span className="font-medium text-primary">Complemento:</span>
                <p className="ml-2 text-secondary inline-block">
                  {vaga.localizacao.complemento}
                </p>
              </div>
            )}

            {vaga.localizacao.regiao && (
              <div className="flex items-center">
                <span className="font-medium text-primary">Região:</span>
                <p className="ml-2 text-secondary inline-block">
                  {vaga.localizacao.regiao}
                </p>
              </div>
            )}
          </Card>
        )}

        {/* Benefícios */}
        {vaga.beneficios && vaga.beneficios.length > 0 && (
          <Card title="Benefícios Oferecidos">
            {vaga.beneficios.map((beneficio: any) => (
              <div key={beneficio.id} className="mb-2 flex items-center">
                <span className="font-medium">{beneficio.nome || 'N/A'}:</span>
                <p className="ml-2 text-secondary inline-block">
                  {beneficio.descricao || 'N/A'}
                </p>
              </div>
            ))}
          </Card>
        )}

        {/* Habilidades */}
        {vaga.habilidades && vaga.habilidades.length > 0 && (
          <Card title="Habilidades Exigidas">
            {vaga.habilidades.map((vh: any) => (
              <div key={vh.habilidadeId} className="mb-2 flex items-center">
                <p className="text-secondary inline-block">
                  {vh.nivelExigido || 'Não especificado'}
                </p>
                <span className="mx-1">-</span>
                <p className="text-secondary inline-block">
                  {vh.habilidade.nome || 'Não especificado'}
                </p>
                <span className="mx-1">-</span>
                <p className="text-secondary inline-block">
                  {vh.habilidade.tipoHabilidade || 'Não especificado'}
                </p>
              </div>
            ))}
          </Card>
        )}

        {/* Anexos */}
        {vaga.anexos && vaga.anexos.length > 0 && (
          <Card title="Anexos da Vaga">
            {vaga.anexos.map((va: any) => (
              <div key={va.anexoId} className="mb-2 flex items-center">
                <a
                  href={va.anexo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  <p className="text-secondary inline-block m-0">
                    {va.anexo.nomeArquivo}
                  </p>
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

      <div className="flex justify-center mt-10 mb-4 relative">
        <h3 className="text-2xl font-bold text-center text-primary w-full ">
          PROFISSIONAIS CADASTRADOS
        </h3>

        <AdminGuard>
          <>
            <PrimaryButton
              className="float-right flex text-nowrap absolute right-0"
              onClick={() => setShowModalCandidato(true)}
            >
              +
            </PrimaryButton>
            <Modal
              title={`${currentTab} Profissional`}
              isOpen={showModalCandidato}
              onClose={() => setShowModalCandidato(false)}
            >
              <Tabs
                tabs={['Consultar', 'Cadastrar']}
                currentTab={currentTab}
                classNameContainer="mt-4"
                classNameTabs="mb-2"
                classNameContent="pt-2"
                onTabChange={tab => setCurrentTab(tab as typeof currentTab)}
              >
                <CandidatoSearch
                  idVaga={vaga.id}
                  onSuccess={async () => {
                    setShowModalCandidato(false);
                    await fetchVaga();
                  }}
                  onDelete={() => console.log('Removido')}
                />

                <CandidatoForm></CandidatoForm>
              </Tabs>
            </Modal>
          </>
        </AdminGuard>
      </div>

      <section className="flex gap-2 w-full flex-wrap">
        {vaga.candidatos ? (
          vaga.candidatos.map((candidato: any, idx: number) => {
            // Exclui o campo 'id' da listagem
            const { id, ...dadosCandidato } = candidato;
            return (
              <Link
                href={`/candidato/${candidato.id}`}
                className="w-full md:max-w-[320px] transform hover:scale-105"
                key={candidato.id}
              >
                <Card key={idx}>
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-2">
                      {/* <span className="font-semibold">Nome:</span> */}
                      <span
                        className="font-bold uppercase truncate md:max-w-[280px] block"
                        title={candidato.pessoa.nome}
                      >
                        {candidato.pessoa.nome ?? '-'}
                      </span>
                    </div>

                    <div className="flex gap-2 text-sm">
                      <span className="font-semibold">Área:</span>
                      <span>{candidato.areaCandidato ?? '-'}</span>
                    </div>
                    <div className="flex gap-2 text-sm">
                      <span className="font-semibold">CRM:</span>
                      <span>
                        <AdminGuard typeText>{candidato.crm ?? '-'}</AdminGuard>
                      </span>
                      {/* <span>{candidato.crm ?? '-'}</span> */}
                    </div>
                    <div className="flex gap-2 text-sm">
                      <span className="font-semibold">RQE:</span>
                      <AdminGuard typeText>{candidato.rqe ?? '-'}</AdminGuard>
                    </div>
                    <div className="flex gap-2 text-sm">
                      <span className="font-semibold">Especialidade:</span>
                      <span>{candidato?.especialidade?.nome ?? '-'}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })
        ) : (
          <p className="text-center w-full">Nenhum Candidato Vinculado</p>
        )}
      </section>

      {/* Modal de Edição (Placeholder) */}
      <Modal
        isOpen={showModalEdit}
        onClose={() => setShowModalEdit(false)}
        title="Editar Vaga"
      >
        <VagaForm
          onSuccess={vaga => {
            setShowModalEdit(false);
            setVaga(vaga);
          }}
          initialValues={vaga}
        />
      </Modal>

      <ModalConfirmation
        isOpen={showModalConfirmationDelete}
        onClose={() => setShowModalConfirmationDelete(false)}
        onClickConfirm={handleDelete}
      ></ModalConfirmation>

      <ModalDelete
        isOpen={showModalDeleteSucess}
        onClose={() => setShowModalDeleteSucess(false)}
        message="Vaga deletada com sucesso!"
        btn={{
          next: {
            label: 'Voltar para Vagas',
            onClick: () => router.push('/vagas'),
          },
        }}
      ></ModalDelete>
    </div>
  );
};

export default VagaPage;
