// pages/candidato/[id].tsx
import api from '@/axios';
import Card from '@/components/Card';
import CandidatoForm from '@/components/form/CandidatoForm';
import { EditPenIcon, TrashIcon } from '@/components/icons';
import Modal from '@/components/modal/Modal';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const CandidatoPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [candidato, setCandidato] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [showModalEdit, setShowModalEdit] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchCandidato = async () => {
      setLoading(true);
      setErro(null);
      try {
        const res = await api.get(`/api/externalWithAuth/candidato/${id}`);
        setCandidato(res.data);
      } catch (_) {
        setErro('Candidato não encontrado ou erro ao buscar dados.');
        setCandidato(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidato();
  }, [id]);

  const handleTrash = async () => {
    if (!candidato) return;
    if (confirm('Tem certeza que deseja excluir este candidato?')) {
      try {
        await api.delete(`/api/candidato/${candidato.id}`);
        router.push('/candidatos');
      } catch {
        alert('Erro ao excluir candidato.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-4 text-primary text-lg">Carregando...</span>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <span className="text-red-600 text-xl font-semibold mb-4">{erro}</span>
      </div>
    );
  }

  if (!candidato) return null;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <section className="bg-white p-4 rounded-2xl">
        <div className="flex mb-8">
          <button
            className="px-2 py-2 bg-primary text-white rounded shadow-md hover:scale-110"
            onClick={() => router.back()}
          >
            Voltar
          </button>
          <h1 className="text-2xl font-bold text-center text-primary w-full">
            Detalhes do Candidato
          </h1>
          <div className="flex gap-2">
            <button
              className="px-2 py-2 bg-[#5f82f3] text-white rounded shadow-md hover:scale-110"
              onClick={() => setShowModalEdit(true)}
            >
              <EditPenIcon />
            </button>
            <button
              className="px-2 py-2 bg-[#f72929] text-white rounded shadow-md hover:scale-110"
              onClick={handleTrash}
            >
              <TrashIcon />
            </button>
          </div>
        </div>

        <h1 className="font-bold text-primary text-xl">
          {candidato.pessoa.nome}
        </h1>

        <div className="flex flex-wrap gap-4">
          {/* Sessão Pessoa */}
          {candidato.pessoa && (
            <Card title="Dados Pessoais">
              <div>
                <span className="font-medium">CPF:</span> {candidato.pessoa.cpf}
              </div>
              <div>
                <span className="font-medium">Data de Nascimento:</span>{' '}
                {candidato.pessoa.dataNascimento
                  ? new Date(
                      candidato.pessoa.dataNascimento
                    ).toLocaleDateString('pt-BR')
                  : 'N/A'}
              </div>
              <div>
                <span className="font-medium">Sexo:</span>{' '}
                {candidato.pessoa.sexo || 'N/A'}
              </div>
            </Card>
          )}

          {/* Sessão Dados do Candidato */}
          <Card title="Dados do Candidato">
            {/* <div>
              <span className="font-medium">ID:</span> {candidato.id}
            </div> */}
            <div>
              <span className="font-medium">Área de Atuação:</span>{' '}
              {candidato.areaCandidato?.replace(/_/g, ' ')}
            </div>

            {candidato.corem && (
              <div>
                <span className="font-medium">CRM:</span>{' '}
                {candidato.crm || 'N/A'}
              </div>
            )}

            {candidato.corem && (
              <div>
                <span className="font-medium">COREM:</span>
                {candidato.corem || 'N/A'}
              </div>
            )}

            {candidato.rqe && (
              <div>
                <span className="font-medium">RQE:</span>{' '}
                {candidato.rqe || 'N/A'}
              </div>
            )}
            <div>
              <span className="font-medium">Especialidade:</span>{' '}
              {candidato.especialidade?.nome || 'N/A'}
            </div>
          </Card>

          {/* Sessão Contatos */}
          {candidato.pessoa?.contatos?.length > 0 && (
            <Card title="Contatos">
              {candidato.pessoa.contatos.map((contato: any) => (
                <div key={contato.id} className="mb-2">
                  {contato.email && <div>Email: {contato.email}</div>}
                  {contato.telefone && <div>Telefone: {contato.telefone}</div>}
                  {contato.whatsapp && <div>WhatsApp: {contato.whatsapp}</div>}
                </div>
              ))}
            </Card>
          )}

          {/* Sessão Localizações */}
          {candidato.pessoa?.localizacoes?.length > 0 && (
            <Card title="Localizações">
              {candidato.pessoa.localizacoes.map((loc: any) => (
                <ul key={loc.id} className="mb-2 list-inside">
                  {loc.cidade && (
                    <li>
                      <span className="font-medium">Cidade:</span> {loc.cidade}
                    </li>
                  )}
                  {loc.estado && (
                    <li>
                      <span className="font-medium">Estado:</span> {loc.estado}
                    </li>
                  )}
                  {loc.cep && (
                    <li>
                      <span className="font-medium">CEP:</span> {loc.cep}
                    </li>
                  )}
                  {loc.bairro && (
                    <li>
                      <span className="font-medium">Bairro:</span> {loc.bairro}
                    </li>
                  )}
                  {loc.uf && (
                    <li>
                      <span className="font-medium">UF:</span> {loc.uf}
                    </li>
                  )}
                  {loc.complemento && (
                    <li>
                      <span className="font-medium">Complemento:</span>{' '}
                      {loc.complemento}
                    </li>
                  )}
                  {loc.logradouro && (
                    <li>
                      <span className="font-medium">Logradouro:</span>{' '}
                      {loc.logradouro}
                    </li>
                  )}
                  {loc.regiao && (
                    <li>
                      <span className="font-medium">Região:</span> {loc.regiao}
                    </li>
                  )}
                </ul>
              ))}
            </Card>
          )}

          {/* Sessão Formações Acadêmicas */}
          {candidato.formacoes?.length > 0 && (
            <Card title="Formações Acadêmicas">
              {candidato.formacoes.map((formacao: any) => (
                <div key={formacao.id} className="mb-2">
                  <div>
                    <span className="font-medium">Instituição:</span>{' '}
                    {formacao.instituicao}
                  </div>
                  <div>
                    <span className="font-medium">Curso:</span> {formacao.curso}
                  </div>
                  <div>
                    <span className="font-medium">Data de Início:</span>{' '}
                    {formacao.dataInicio
                      ? new Date(formacao.dataInicio).toLocaleDateString(
                          'pt-BR'
                        )
                      : 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Data de Fim:</span>{' '}
                    {formacao.dataFim
                      ? new Date(formacao.dataFim).toLocaleDateString('pt-BR')
                      : 'N/A'}
                  </div>
                  {formacao.dataInicioResidencia && (
                    <div>
                      <span className="font-medium">Início Residência:</span>{' '}
                      {new Date(
                        formacao.dataInicioResidencia
                      ).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                  {formacao.dataFimResidencia && (
                    <div>
                      <span className="font-medium">Fim Residência:</span>{' '}
                      {new Date(formacao.dataFimResidencia).toLocaleDateString(
                        'pt-BR'
                      )}
                    </div>
                  )}
                </div>
              ))}
            </Card>
          )}

          {/* Sessão Habilidades */}
          {candidato.habilidades?.length > 0 && (
            <Card title="Habilidades">
              {candidato.habilidades.map((hab: any) => (
                <div key={hab.habilidadeId} className="mb-2">
                  <div>
                    <span className="font-medium">Habilidade:</span>{' '}
                    {hab.habilidade?.nome}
                  </div>
                  <div>
                    <span className="font-medium">Nível:</span>{' '}
                    {hab.nivel || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Anos de Experiência:</span>{' '}
                    {hab.experienciaAnos || 'N/A'}
                  </div>
                </div>
              ))}
            </Card>
          )}

          {/* Sessão Vagas */}
          {candidato.vagas?.length > 0 && (
            <Card title="Vagas Associadas">
              {candidato.vagas.map((vaga: any) => (
                <div key={vaga.id} className="mb-2">
                  <div>
                    <span className="font-medium">Título:</span> {vaga.titulo}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span> {vaga.status}
                  </div>
                  {/* Adicione mais campos relevantes da vaga se necessário */}
                </div>
              ))}
            </Card>
          )}

          {/* Sessão Candidaturas em Vagas */}
          {candidato.CandidaturaVaga?.length > 0 && (
            <Card title="Candidaturas em Vagas">
              {candidato.CandidaturaVaga.map((cand: any) => (
                <div key={cand.id} className="mb-2">
                  <div>
                    <span className="font-medium">Vaga:</span>{' '}
                    {cand.vaga?.titulo || cand.vagaId}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span> {cand.status}
                  </div>
                  {/* Adicione mais campos relevantes da candidatura se necessário */}
                </div>
              ))}
            </Card>
          )}
        </div>
      </section>

      <div className="flex justify-center mt-10 mb-4 relative">
        <h3 className="text-2xl font-bold text-center text-primary w-full ">
          VAGAS CANDIDATADAS
        </h3>
      </div>

      <section className="flex gap-2 w-full flex-wrap items-center justify-center lg:justify-between">
        {candidato?.vagas && candidato.vagas.length > 0 ? (
          <>
            {candidato?.vagas.map((vaga: any) => (
              <Link
                href={`/vaga/${vaga.id}`}
                className="w-full lg:max-w-[330px]"
                key={vaga.id}
              >
                <Card
                  title={{
                    className: 'text-xl text-center',
                    label: vaga.titulo,
                  }}
                  classNameContainer="cursor-pointer shadow-sm border border-gray-200 hover:scale-105 hover:shadow-md text-sm px-6 py-4"
                >
                  <div className="flex flex-col justify-between gap-2 mt-2">
                    <div className="text-sm">
                      <span>Publicado:</span>
                      <span className="text-secondary">
                        {vaga.dataPublicacao}
                      </span>
                    </div>

                    <div>
                      <span className="font-medium">Status:</span>
                      <span className="ml-1 text-secondary">{vaga.status}</span>
                    </div>
                  </div>

                  <div>
                    <span className="font-medium">Categoria:</span>
                    <span className="ml-1 text-secondary">
                      {vaga.categoria}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Tipo de Salário:</span>
                    <span className="ml-1 text-secondary">
                      {vaga.tipoSalario}
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </>
        ) : (
          <span className="text-primary text-center">
            Nenhuma vaga cadastrada para este cliente.
          </span>
        )}
      </section>

      <Modal
        isOpen={showModalEdit}
        onClose={() => setShowModalEdit(false)}
        title="Editar Candidato"
      >
        <CandidatoForm
          onSuccess={candidato => {
            setShowModalEdit(false);
            setCandidato(candidato);
          }}
          initialValues={candidato}
        />
      </Modal>
    </div>
  );
};

export default CandidatoPage;
