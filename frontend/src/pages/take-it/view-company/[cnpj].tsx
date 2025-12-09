import { searchApi } from '@/axios/searchApi';
import ClienteForm from '@/components/form/ClienteForm';
import { SearchIcon } from '@/components/icons';
import Modal from '@/components/modal/Modal';
import Card from '@/components/takeit/Card';
import { Info } from '@/components/takeit/Info';
import {
  convertDataStoneToClienteWithEmpresaInput,
  DataStoneCompanyApiResponse,
} from '@/dto/dataStoneCliente.dto';
import { exportToCSV, exportToPDF, mostrarValor } from '@/utils/exportCSV';
import { handleZeroLeft } from '@/utils/helper/helperCPF';
import { mask } from '@/utils/mask/mask';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';

const ViewCompanyPage: React.FC = () => {
  const router = useRouter();
  const { cnpj } = router.query;

  const [company, setCompany] = useState<DataStoneCompanyApiResponse | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showModalCliente, setShowModalCliente] = useState<boolean>(false);
  const [clienteSalvo, setClienteSalvo] = useState<boolean>(false);
  const [clienteId, setClienteId] = useState<string | null>(null);
  const [cache, setCache] = useState(false);

  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Busca empresa e verifica se já é cliente
  const fetchCompany = async (cnpjValue: string) => {
    setLoading(true);
    setError(null);
    setCompany(null);

    try {
      const data = await searchApi(cnpjValue, 'companies', 'CNPJ');
      if (data?.data?.length && data?.data[0]) {
        setCompany(data.data[0]);
        console.log(data);
        if (data?.cache) {
          setCache(data.cache);
        }

        if (data?.cliente?.id) {
          setClienteId(data?.cliente?.id);
        }
      } else {
        setError('Empresa não encontrada.');
      }
    } catch {
      setError('Erro ao buscar dados.');
      setCompany(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cnpj) {
      fetchCompany(String(cnpj));
    }
  }, [cnpj]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        showExportDropdown &&
        !(event.target as HTMLElement).closest('#export-dropdown') &&
        !(event.target as HTMLElement).closest('#export-btn')
      ) {
        setShowExportDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showExportDropdown]);

  // Exportação
  const handleExport = async (type: 'csv' | 'pdf') => {
    setShowExportDropdown(false);
    if (!company) return;
    if (type === 'csv') {
      exportToCSV(company);
    } else if (type === 'pdf') {
      await exportToPDF(cardRef as React.RefObject<HTMLDivElement>);
    }
  };

  // Modal Cliente
  const handleOpenModalCliente = () => setShowModalCliente(true);
  const handleCloseModalCliente = () => setShowModalCliente(false);
  const handleClienteSalvo = (cliente: any) => {
    console.log(cliente);
    setShowModalCliente(false);
    setClienteSalvo(true);
    setClienteId(cliente?.id || cliente?._id || null);
  };

  // Render
  if (loading) {
    return <div className="p-8 text-center text-gray-500">Carregando...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }
  if (!company) {
    return (
      <div className="p-8 text-center text-gray-500">
        Nenhum dado disponível para exibir.
      </div>
    );
  }

  // Conversão correta dos dados para o DTO para uso no formulário
  const initialFormValues = convertDataStoneToClienteWithEmpresaInput(company);

  return (
    <div className="px-4 py-2 mb-30">
      <div className="flex flex-wrap gap-2 justify-between">
        <button onClick={() => router.back()} className="buttonPrimary">
          Voltar
        </button>
        <div className="flex gap-2">
          {clienteId ? (
            <Link
              href={`/cliente/${clienteId}`}
              className={`h-9 px-4 ${
                clienteId ? 'buttonPrimary-outlined' : 'buttonPrimary'
              } flex items-center`}
              title="Consultar Cliente"
              data-testid="consultar-cliente-btn"
            >
              Consultar Cliente
              <SearchIcon style={{ padding: '2px' }} />
            </Link>
          ) : (
            <button
              className="buttonPrimary flex items-center px-3"
              onClick={handleOpenModalCliente}
              type="button"
              title="Salvar como Cliente"
              data-testid="salvar-cliente-btn"
            >
              Salvar Cliente
              <svg
                className="ml-1 w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}

          {/* Exportação (opcional) */}
          {/* <div className="relative inline-block" id="export-dropdown">
            <button
              id="export-btn"
              className="buttonPrimary ml-2"
              type="button"
              onClick={() => setShowExportDropdown(!showExportDropdown)}
            >
              Exportar
              <svg
                className="ml-1 w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M12 5v14m7-7H5" />
              </svg>
            </button>
            {showExportDropdown && (
              <div className="absolute z-10 mt-2 w-36 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => handleExport('csv')}
                  type="button"
                >
                  Exportar CSV
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => handleExport('pdf')}
                  type="button"
                >
                  Exportar PDF
                </button>
              </div>
            )}
          </div> */}
        </div>
      </div>

      <div className="flex flex-wrap items-center mb-1 gap-2">
        <span className="rounded bg-primary/10 font-medium text-primary py-1 text-sm select-none">
          {cache ? 'Cache: SIM' : 'Cache: NÃO'}
        </span>
      </div>

      {/* Modal Cliente */}
      <Modal
        isOpen={showModalCliente}
        onClose={handleCloseModalCliente}
        title="Salvar Empresa como Cliente"
      >
        <ClienteForm
          initialValues={initialFormValues}
          onSuccess={handleClienteSalvo}
        />
      </Modal>

      {/* Dados da Empresa */}
      <h1 className="text-2xl mb-4 font-black">
        <strong className="text-primary text-lg">Razão Social:</strong>{' '}
        {mostrarValor(company.company_name)}
      </h1>
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-2"
        id="card"
        ref={cardRef}
      >
        <Card
          className="md:col-start-1 md:col-end-3 "
          title={
            <strong className="text-primary text-lg">Dados da Empresa</strong>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <Info label="CNPJ" value={mask(handleZeroLeft(company.cnpj))} />
            <Info label="Nome Fantasia" value={company.trading_name} />
            <Info label="Data de Abertura" value={company.creation_date} />
            <Info label="Receita Estimada" value={company.estimated_revenue} />
            <Info label="Capital Social" value={company.share_capital} />
            <Info label="Cidade/UF" value={company.city_uf} />
            <Info label="Segmento" value={company.segment} />
            <Info label="Idade" value={company.age} />
            <Info label="Funcionários" value={company.employee_count} />
            <Info label="Tipo de Matriz" value={company.headquarter_type} />
            <Info label="Porte" value={company.business_size} />
            <Info
              label="Situação Cadastral"
              value={company.registry_situation}
            />
            <Info
              label="CNAE"
              value={
                (company.cnae_code ? company.cnae_code + ' - ' : '') +
                (company.cnae_description || '')
              }
            />
            <Info label="Tipo Jurídico" value={company.juridical_type} />
          </div>
        </Card>
        {/* Telefones Celulares */}
        <Card
          title={
            <strong className="text-primary text-lg">
              Telefones Celulares
            </strong>
          }
        >
          {company.mobile_phones && company.mobile_phones.length > 0 ? (
            <div className="space-y-1 flex flex-wrap gap-2">
              {company.mobile_phones.map((phone, idx) => (
                <div
                  key={idx}
                  className=" bg-gray-100 last:border-b-0 rounded-xl p-2 w-fit"
                >
                  <div className="flex flex-wrap gap-x-10 gap-y-4">
                    <Info
                      value={
                        phone.ddd && phone.number
                          ? `(${phone.ddd})${phone.number}`
                          : ''
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-primary">Nenhum celular cadastrado.</div>
          )}
        </Card>
        {/* Telefones Fixos */}
        <Card
          title={
            <strong className="text-primary text-lg">Telefones Fixos</strong>
          }
        >
          {company.land_lines && company.land_lines.length > 0 ? (
            <div className="space-y-1 flex flex-wrap gap-2">
              {company.land_lines.map((phone, idx) => (
                <div key={idx} className=" bg-gray-100  p-2 rounded-xl">
                  <div className="flex flex-wrap gap-x-10 gap-y-4">
                    <Info
                      value={
                        phone.ddd && phone.number
                          ? `(${phone.ddd})${phone.number}`
                          : ''
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-primary">Nenhum telefone fixo cadastrado.</div>
          )}
        </Card>
        {/* E-mails da Empresa */}
        <Card title={<strong className="text-primary text-lg">E-mails</strong>}>
          {company.emails && company.emails.length > 0 ? (
            <div className="space-y-1 flex flex-wrap gap-1">
              {company.emails.map((email, idx) => (
                <div key={idx} className="bg-gray-100 rounded-xl p-2 w-fit">
                  <div className="flex flex-wrap gap-x-10 gap-y-4">
                    <Info value={email.email} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-primary">Nenhum e-mail cadastrado.</div>
          )}
        </Card>
        {/* Simples Nacional / SIMEI */}
        <Card
          title={
            <strong className="text-primary text-lg">
              Simples Nacional / SIMEI
            </strong>
          }
        >
          <div className="flex flex-wrap justify-between gap-x-10">
            <Info
              label="Status Simples"
              value={company.simple_simei?.status_simple}
            />
            <Info
              label="Data Opção Simples"
              value={company.simple_simei?.dt_option_simple}
            />
            <Info
              label="Status SIMEI"
              value={company.simple_simei?.status_simei}
            />
            <Info
              label="Data Opção SIMEI"
              value={company.simple_simei?.dt_option_simei}
            />
          </div>
        </Card>
        {/* Endereços */}
        <Card
          title={<strong className="text-primary text-lg">Endereços</strong>}
        >
          {company.addresses && company.addresses.length > 0 ? (
            <div className="bg-gray-100 p-2 rounded-xl space-y-2">
              {company.addresses.map((addr, idx) => (
                <div
                  key={idx}
                  className="border-b last:border-b-0 pb-2 last:pb-0"
                >
                  <div className="flex flex-wrap justify-between gap-x-10">
                    <Info label="Tipo" value={addr.type} />

                    <Info label="Bairro" value={addr.neighborhood} />
                    <Info
                      label="Cidade"
                      value={[addr.city, addr.district]
                        .filter(Boolean)
                        .join(' - ')}
                    />
                    <Info label="CEP" value={addr.postal_code} />
                    {/* <Info
                      label="Prioridade"
                      value={addr.priority}
                      hideIfEmpty
                    /> */}
                    <Info
                      label="Rua"
                      value={[addr.street, addr.number, addr.complement]
                        .filter(Boolean)
                        .join(', ')}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-primary">Nenhum endereço cadastrado.</div>
          )}
        </Card>

        {/* Sócios/Representantes */}
        <Card
          title={
            <strong className="text-primary text-lg">
              Sócios / Pessoas Relacionadas
            </strong>
          }
        >
          {company.related_persons && company.related_persons.length > 0 ? (
            <div className="space-y-1">
              {company.related_persons.map((person, idx) => (
                <div key={idx} className="bg-gray-100 rounded-xl p-2">
                  <div className="flex flex-wrap gap-x-10 ">
                    <Info label="Nome" value={person.name} />
                    <div className="flex items-center gap-2">
                      <Info
                        label="CPF"
                        value={mask(handleZeroLeft(person.cpf))}
                      />
                      {person.cpf && (
                        <Link
                          href={`/take-it/view-person/${handleZeroLeft(
                            person.cpf
                          )}`}
                          className="bg-primary rounded p-1"
                        >
                          <SearchIcon color="white" style={{ padding: 2 }} />
                        </Link>
                      )}
                    </div>
                    <Info label="Participação" value={person.ownership} />
                    <Info
                      label="Descrição"
                      value={person.description}
                      hideIfEmpty
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-primary">
              Nenhum sócio/pessoa relacionada cadastrada.
            </div>
          )}
        </Card>

        {/* Filiais */}
        <Card title={<strong className="text-primary text-lg">Filiais</strong>}>
          {company.branch_offices && company.branch_offices.length > 0 ? (
            <div className="bg-gray-100 p-2 rounded-xl space-y-2">
              {company.branch_offices.map((branch, idx) => (
                <div
                  key={idx}
                  className="border-b last:border-b-0 pb-2 last:pb-0"
                >
                  <div className="flex flex-wrap gap-x-10">
                    <div className="flex items-center gap-2">
                      <Info
                        label="CNPJ"
                        value={mask(handleZeroLeft(branch.cnpj))}
                      />
                      {branch.cnpj && (
                        <Link
                          href={`/take-it/view-company/${handleZeroLeft(
                            branch.cnpj
                          )}`}
                          className="bg-primary rounded p-1"
                        >
                          <SearchIcon color="white" style={{ padding: 2 }} />
                        </Link>
                      )}
                    </div>
                    <Info label="Razão Social" value={branch.company_name} />
                    <Info
                      label="Descrição"
                      value={branch.ds_branch_office}
                      hideIfEmpty
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-primary">Nenhuma filial cadastrada.</div>
          )}
        </Card>
        {/* Empresas Relacionadas */}
        <Card
          title={
            <strong className="text-primary text-lg">
              Empresas Relacionadas
            </strong>
          }
        >
          {company.related_companies && company.related_companies.length > 0 ? (
            <div className="bg-gray-100 p-2 rounded-xl space-y-2">
              {company.related_companies.map((rel, idx) => (
                <div
                  key={idx}
                  className="border-b last:border-b-0 pb-2 last:pb-0"
                >
                  <div className="flex flex-wrap gap-x-10 gap-y-4">
                    <Info label="Razão Social" value={rel.name} />
                    <div className="flex items-center gap-2">
                      <Info
                        label="CNPJ"
                        value={mask(handleZeroLeft(rel.cnpj))}
                      />
                      {rel.cnpj && (
                        <Link
                          href={`/take-it/view-company/${rel.cnpj}`}
                          className="bg-primary rounded p-1"
                        >
                          <SearchIcon color="white" style={{ padding: 2 }} />
                        </Link>
                      )}
                    </div>
                    <Info label="Participação" value={rel.ownership} />
                    <Info
                      label="Descrição"
                      value={rel.description}
                      hideIfEmpty
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-primary">
              Nenhuma empresa relacionada cadastrada.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ViewCompanyPage;
