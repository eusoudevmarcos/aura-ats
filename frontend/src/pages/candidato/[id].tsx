// pages/candidato/[id].tsx
import api from '@/axios';
import { AdminGuard } from '@/components/auth/AdminGuard';
import ButtonCopy from '@/components/button/ButtonCopy';
import Card from '@/components/Card';
import { AgendaForm } from '@/components/form/AgendaForm';
import CandidatoForm from '@/components/form/CandidatoForm';
import { EditPenIcon, TrashIcon } from '@/components/icons';
import Modal from '@/components/modal/Modal';
import ModalPdfViewer from '@/components/modal/ModalPdfViewer';
import { useAdmin } from '@/context/AuthContext';
import useFetchWithPagination from '@/hook/useFetchWithPagination';
import { SessionProvider } from 'next-auth/react';
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
  const [showModalAgendaEdit, setShowModalAgendaEdit] = useState(false);
  const [showModalPdf, setShowModalPdf] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string>('');
  const [selectedPdfName, setSelectedPdfName] = useState<string>('');

  const isAdmin = useAdmin();

  const {
    data: vagas,
    total: totalRecords,
    totalPages,
    loading: isLoadingVagas,
    setPage,
    setPageSize,
    page,
    pageSize,
    refetch: refetchVagas,
  } = useFetchWithPagination(
    `/api/externalWithAuth/vaga/candidato/${candidato?.id}`,
    candidato && candidato.id ? { search: candidato.id } : {},
    {
      pageSize: 5,
      page: 1,
      dependencies: [candidato?.id],
      manual: true,
      requestOptions: {},
    }
  );

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

  useEffect(() => {
    if (candidato && candidato.id) {
      refetchVagas({ search: candidato.id });
    }
  }, [candidato]);

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
      <section className="p-4 rounded-2xl">
        <div className="flex mb-8">
          <button
            className="px-2 py-2 bg-primary text-white rounded shadow-md hover:scale-110"
            onClick={() => router.back()}
          >
            Voltar
          </button>
          <h1 className="text-2xl font-bold text-center text-primary w-full">
            PROFISSIONAL
          </h1>
          <AdminGuard>
            <div className="flex gap-2">
              <button
                className="px-2 py-2 bg-green-500 text-white rounded shadow-md hover:scale-110 flex justify-center items-center"
                onClick={() => setShowModalAgendaEdit(true)}
              >
                <span className="material-icons-outlined">date_range</span>
              </button>
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
          </AdminGuard>
        </div>

        <div className="flex flex-wrap gap-4">
          {/* Sessão Pessoa */}
          {candidato.pessoa && (
            <Card title="Dados Pessoais">
              <span className="font-medium mr-2">Nome:</span>
              <span className="font-bold text-xl">{candidato.pessoa.nome}</span>
              <div>
                <span className="font-medium">Data de Nascimento:</span>
                <span className="text-secondary ml-2">
                  {candidato.pessoa.dataNascimento || '-'}
                </span>
              </div>

              <div>
                <span className="font-medium">CPF:</span>
                <span className="text-secondary ml-2">
                  <AdminGuard typeText>
                    {candidato.pessoa.cpf || '-'}
                  </AdminGuard>
                </span>
              </div>

              <div>
                <span className="font-medium">Sexo:</span>
                <span className="text-secondary ml-2">
                  {candidato.pessoa.sexo || '-'}
                </span>
              </div>
            </Card>
          )}

          {/* Sessão Dados do Candidato */}
          <Card title="Dados do Candidato">
            <div>
              <span className="font-medium">Área de Atuação:</span>
              <span className="text-secondary ml-2">
                {candidato.areaCandidato?.replace(/_/g, ' ') || '-'}
              </span>
            </div>

            {candidato.crm && (
              <div>
                <span className="font-medium">CRM:</span>
                <span className="text-secondary ml-2">
                  <AdminGuard typeText>{candidato.crm || '-'}</AdminGuard>
                </span>
              </div>
            )}

            {candidato.corem && (
              <div>
                <span className="font-medium">COREM:</span>
                <span className="text-secondary ml-2">
                  <AdminGuard typeText>{candidato.corem || '-'}</AdminGuard>
                </span>
              </div>
            )}

            {candidato.rqe && (
              <div>
                <span className="font-medium">RQE:</span>
                <span className="text-secondary ml-2">
                  <AdminGuard typeText>{candidato.rqe || '-'}</AdminGuard>
                </span>
              </div>
            )}
            <div>
              <span className="font-medium">Especialidade:</span>
              <span className="text-secondary ml-2">
                {candidato.especialidade?.nome || 'N/A'}
              </span>
            </div>
          </Card>

          {/* Sessão Contatos */}
          <Card title="Contatos">
            <>
              {candidato.emails && candidato.emails.length > 0 && (
                <div>
                  <span className="font-medium">Emails:</span>
                  <span className="text-secondary ml-2">
                    {candidato.emails}
                  </span>
                </div>
              )}

              {candidato.contatos && candidato.contatos.length > 0 && (
                <div>
                  <span className="font-medium">Contatos:</span>
                  <span className="text-secondary ml-2">
                    {candidato.contatos || '-'}
                  </span>
                </div>
              )}
            </>
          </Card>

          {/* Sessão Localizações */}
          {candidato.pessoa?.localizacoes?.length > 0 && (
            <Card title="Localizações">
              {candidato.pessoa.localizacoes.map((loc: any) => (
                <ul key={loc.id} className="mb-2 list-inside">
                  {loc.cidade && (
                    <li>
                      <span className="font-medium">Cidade:</span>
                      <span className="text-secondary ml-2">{loc.cidade}</span>
                    </li>
                  )}
                  {loc.estado && (
                    <li>
                      <span className="font-medium">Estado:</span>
                      <span className="text-secondary ml-2">{loc.estado}</span>
                    </li>
                  )}
                  {loc.cep && (
                    <li>
                      <span className="font-medium">CEP:</span>
                      <span className="text-secondary ml-2">{loc.cep}</span>
                    </li>
                  )}
                  {loc.bairro && (
                    <li>
                      <span className="font-medium">Bairro:</span>
                      <span className="text-secondary ml-2">{loc.bairro}</span>
                    </li>
                  )}
                  {loc.uf && (
                    <li>
                      <span className="font-medium">UF:</span>
                      <span className="text-secondary ml-2">{loc.uf}</span>
                    </li>
                  )}
                  {loc.complemento && (
                    <li>
                      <span className="font-medium">Complemento:</span>
                      <span className="text-secondary ml-2">
                        {loc.complemento}
                      </span>
                    </li>
                  )}
                  {loc.logradouro && (
                    <li>
                      <span className="font-medium">Logradouro:</span>
                      <span className="text-secondary ml-2">
                        {loc.logradouro}
                      </span>
                    </li>
                  )}
                  {loc.regiao && (
                    <li>
                      <span className="font-medium">Região:</span>
                      <span className="text-secondary ml-2">{loc.regiao}</span>
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
                    <span className="font-medium">Instituição:</span>
                    <span className="text-secondary ml-2">
                      {formacao.instituicao}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Curso:</span>
                    <span className="text-secondary ml-2">
                      {formacao.curso}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Data de Início:</span>
                    <span className="text-secondary ml-2">
                      {formacao.dataInicio
                        ? new Date(formacao.dataInicio).toLocaleDateString(
                            'pt-BR'
                          )
                        : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Data de Fim:</span>
                    <span className="text-secondary ml-2">
                      {formacao.dataFim
                        ? new Date(formacao.dataFim).toLocaleDateString('pt-BR')
                        : 'N/A'}
                    </span>
                  </div>
                  {formacao.dataInicioResidencia && (
                    <div>
                      <span className="font-medium">Início Residência:</span>
                      <span className="text-secondary ml-2">
                        {new Date(
                          formacao.dataInicioResidencia
                        ).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  )}
                  {formacao.dataFimResidencia && (
                    <div>
                      <span className="font-medium">Fim Residência:</span>
                      <span className="text-secondary ml-2">
                        {new Date(
                          formacao.dataFimResidencia
                        ).toLocaleDateString('pt-BR')}
                      </span>
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
                    <span className="font-medium">Habilidade:</span>
                    <span className="text-secondary ml-2">
                      {hab.habilidade?.nome}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Nível:</span>
                    <span className="text-secondary ml-2">
                      {hab.nivel || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Anos de Experiência:</span>
                    <span className="text-secondary ml-2">
                      {hab.experienciaAnos || 'N/A'}
                    </span>
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
                    <span className="font-medium">Título:</span>
                    <span className="text-secondary ml-2">{vaga.titulo}</span>
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <span className="text-secondary ml-2">{vaga.status}</span>
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
                    <span className="font-medium">Vaga:</span>
                    <span className="text-secondary ml-2">
                      {cand.vaga?.titulo || cand.vagaId}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <span className="text-secondary ml-2">{cand.status}</span>
                  </div>
                  {/* Adicione mais campos relevantes da candidatura se necessário */}
                </div>
              ))}
            </Card>
          )}

          {candidato.links && candidato.links.length > 0 && (
            <Card title="Links" classNameContent="flex flex-col gap-2">
              {candidato.links.map((link: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 bg-gray-100 inset-shadow-2xs inset-shadow-black-200 rounded-full pl-5 pr-0.5 py-0.5 hover:bg-gray-200 transition-colors"
                >
                  <span
                    className="text-black break-all truncate max-w-sm sm:max-w-md md:max-w-lg block"
                    title={link}
                  >
                    {link}
                  </span>
                  <ButtonCopy
                    value={link}
                    className="text-primary! px-3! rounded-full! bg-white!"
                  />
                </div>
              ))}
            </Card>
          )}
          {/* Sessão Anexos */}
          {candidato.anexos && candidato.anexos.length > 0 && (
            <Card title="Anexos">
              <div className="flex flex-col gap-2">
                {candidato.anexos.map((candidatoAnexo: any) => {
                  const anexo = candidatoAnexo.anexo;
                  const isPdf = anexo.tipo === 'pdf';
                  const downloadUrl = `/api/externalWithAuth/candidato/anexo/${anexo.url}/download`;

                  const handleDownload = async () => {
                    if (isPdf) {
                      // Abre modal para PDF
                      setSelectedPdfUrl(
                        process.env.NEXT_PUBLIC_API_URL + anexo.url
                      );
                      setSelectedPdfName(anexo.nomeArquivo);
                      setShowModalPdf(true);
                    } else {
                      // Download direto para outros tipos
                      try {
                        const response = await api.get(downloadUrl, {
                          responseType: 'blob',
                        });
                        const url = window.URL.createObjectURL(
                          new Blob([response.data])
                        );
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', anexo.nomeArquivo);
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                        window.URL.revokeObjectURL(url);
                      } catch (error) {
                        console.error('Erro ao fazer download:', error);
                        alert('Erro ao fazer download do arquivo');
                      }
                    }
                  };

                  return (
                    <div
                      key={anexo.id}
                      className="flex items-center justify-between gap-2 bg-gray-100 rounded-lg p-3 hover:bg-gray-200 transition-colors"
                    >
                      <div className="flex flex-col flex-1">
                        <span className="font-medium text-sm">
                          {anexo.nomeArquivo}
                        </span>
                        {anexo.tamanhoKb && (
                          <span className="text-xs text-gray-500">
                            {(anexo.tamanhoKb / 1024).toFixed(2)} MB
                          </span>
                        )}
                      </div>
                      <button
                        onClick={handleDownload}
                        className=" bg-white text-primary rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium shadow-md p-2 flex items-center justify-center cursor-pointer scale-105"
                      >
                        <span className="material-icons text-base">
                          {isPdf ? 'visibility' : 'download'}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      </section>

      <div className="flex justify-center mt-10 mb-4 relative">
        <h3 className="text-2xl font-bold text-center text-primary w-full">
          VAGAS CANDIDATADAS
        </h3>
      </div>

      <section className="flex gap-2 w-full flex-wrap items-center justify-center lg:justify-between">
        {vagas && vagas.length > 0 ? (
          <>
            {vagas.map((vaga: any) => (
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

      <SessionProvider>
        <Modal
          isOpen={showModalAgendaEdit}
          onClose={() => setShowModalAgendaEdit(false)}
          title="Editar Candidato"
        >
          <AgendaForm
            onSuccess={agenda => {
              setShowModalAgendaEdit(false);
            }}
            initialValues={{
              candidatoId: candidato.id,
              candidato: candidato,
              convidados: [candidato.email],
            }}
          />
        </Modal>
      </SessionProvider>

      <ModalPdfViewer
        isOpen={showModalPdf}
        onClose={() => {
          setShowModalPdf(false);
          setSelectedPdfUrl('');
          setSelectedPdfName('');
        }}
        fileUrl={selectedPdfUrl}
        fileName={selectedPdfName}
      />
    </div>
  );
};

export default CandidatoPage;
