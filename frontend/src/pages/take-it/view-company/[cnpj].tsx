import { searchApi } from '@/axios/searchApi';
import { SearchIcon } from '@/components/icons';
import Card from '@/components/takeit/Card';
import { exportToCSV, exportToPDF, mostrarValor } from '@/utils/exportCSV';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';

interface Company {
  company_name?: string;
  cnpj?: string;
  trading_name?: string;
  creation_date?: string;
  estimated_revenue?: string;
  share_capital?: string;
  city_uf?: string;
  segment?: string;
  age?: string;
  employee_count?: string;
  headquarter_type?: string;
  business_size?: string;
  registry_situation?: string;
  cnae_code?: string;
  cnae_description?: string;
  juridical_type?: string;
  addresses?: Address[];
  mobile_phones?: Phone[];
  land_lines?: Phone[];
  emails?: Email[];
  related_persons?: RelatedPerson[];
  legal_representative?: LegalRepresentative[];
  branch_offices?: BranchOffice[];
  related_companies?: RelatedCompany[];
  related_emails?: RelatedEmail[];
  simple_simei?: SimpleSimei;
  [key: string]: any;
}

interface Address {
  type?: string;
  street?: string;
  number?: string | number;
  complement?: string;
  neighborhood?: string;
  city?: string;
  district?: string;
  postal_code?: string;
  priority?: string;
}

interface Phone {
  ddd?: string;
  number?: string;
  priority?: string;
}

interface Email {
  email?: string;
  priority?: string;
}

interface RelatedPerson {
  name?: string;
  cpf?: string;
  description?: string;
  ownership?: string;
}

interface LegalRepresentative {
  name?: string;
  cpf?: string;
  qualification?: string;
}

interface BranchOffice {
  company_name?: string;
  cnpj?: string;
  ds_branch_office?: string;
}

interface RelatedCompany {
  name?: string;
  cnpj?: string;
  description?: string;
  ownership?: string;
}

interface RelatedEmail {
  email?: string;
}

interface SimpleSimei {
  status_simple?: string;
  dt_option_simple?: string;
  status_simei?: string;
  dt_option_simei?: string;
}

const ViewCompanyPage: React.FC = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const router = useRouter();
  const cnpj = router.query.cnpj as string;
  const cardRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    setCompany(null);

    try {
      const data = await searchApi(cnpj || '', 'companies');
      if (data?.data?.length && data?.data[0]) {
        setCompany(data.data[0]);
      } else {
        setError('Empresa não encontrada.');
      }
    } catch (error: any) {
      setError('Erro ao buscar dados.');
      setCompany(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cnpj) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleExport = async (type: 'csv' | 'pdf') => {
    setShowExportDropdown(false);
    if (!company) return;
    if (type === 'csv') {
      exportToCSV(company);
    } else if (type === 'pdf') {
      await exportToPDF(cardRef as React.RefObject<HTMLDivElement>);
    }
  };

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

  return (
    // <TakeitLayout fit>
    //   {({}) => (
    <div className="px-4 py-2 mb-30">
      <div className="flex justify-between mb-10 px-4 py-2">
        <button
          onClick={() => router.push('/take-it')}
          className="buttonPrimary"
        >
          Voltar
        </button>
        <div className="relative inline-block" id="export-dropdown">
          <button
            id="export-btn"
            className="buttonPrimary flex items-center"
            onClick={() => setShowExportDropdown(prev => !prev)}
            type="button"
          >
            Exportar
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {showExportDropdown && (
            <div className="absolute z-10 mt-2 w-36 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => handleExport('csv')}
              >
                Exportar CSV
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => handleExport('pdf')}
              >
                Exportar PDF
              </button>
            </div>
          )}
        </div>
      </div>
      <h1 className="text-2xl mb-4 font-black">
        <span className="text-primary">Razão Social:</span>{' '}
        {mostrarValor(company.company_name)}
      </h1>
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-2"
        id="card"
        ref={cardRef}
      >
        {/* Dados da Empresa */}
        <Card
          title={<span className="text-primary">Dados da Empresa</span>}
          className={'md:col-start-1 md:col-end-3'}
        >
          <div className="flex flex-wrap space-y-4 space-x-9">
            <p className="font-medium">
              <strong className="text-primary">CNPJ:</strong>{' '}
              {mostrarValor(company.cnpj)}
            </p>
            <p className="font-medium">
              <strong className="text-primary">Nome Fantasia:</strong>{' '}
              {mostrarValor(company.trading_name)}
            </p>
            <p className="font-medium">
              <strong className="text-primary">Data de Abertura:</strong>{' '}
              {mostrarValor(company.creation_date)}
            </p>
            <p className="font-medium">
              <strong className="text-primary">Receita Estimada:</strong>{' '}
              {mostrarValor(company.estimated_revenue)}
            </p>
            <p className="font-medium">
              <strong className="text-primary">Capital Social:</strong>{' '}
              {mostrarValor(company.share_capital)}
            </p>
            <p className="font-medium">
              <strong className="text-primary">Cidade/UF:</strong>{' '}
              {mostrarValor(company.city_uf)}
            </p>
            <p className="font-medium">
              <strong className="text-primary">Segmento:</strong>{' '}
              {mostrarValor(company.segment)}
            </p>
            <p className="font-medium">
              <strong className="text-primary">Idade:</strong>{' '}
              {mostrarValor(company.age)}
            </p>
            <p className="font-medium">
              <strong className="text-primary">Funcionários:</strong>{' '}
              {mostrarValor(company.employee_count)}
            </p>
            <p className="font-medium">
              <strong className="text-primary">Tipo de Matriz:</strong>{' '}
              {mostrarValor(company.headquarter_type)}
            </p>
            <p className="font-medium">
              <strong className="text-primary">Porte:</strong>{' '}
              {mostrarValor(company.business_size)}
            </p>
            <p className="font-medium">
              <strong className="text-primary">Situação Cadastral:</strong>{' '}
              {mostrarValor(company.registry_situation)}
            </p>
            <p className="font-medium">
              <strong className="text-primary">CNAE:</strong>{' '}
              {mostrarValor(company.cnae_code)}
              {' - '}
              {mostrarValor(company.cnae_description)}
            </p>
            <p className="font-medium">
              <strong className="text-primary">Tipo Jurídico:</strong>{' '}
              {mostrarValor(company.juridical_type)}
            </p>
          </div>
        </Card>
        {/* Simples e SIMEI */}
        <Card
          title={<span className="text-primary">Simples Nacional / SIMEI</span>}
        >
          <div className="flex flex-wrap space-y-4 space-x-9">
            <p className="font-medium">
              <strong className="text-primary">Status Simples:</strong>{' '}
              {mostrarValor(company.simple_simei?.status_simple)}
            </p>
            <p className="font-medium">
              <strong className="text-primary">Data Opção Simples:</strong>{' '}
              {mostrarValor(company.simple_simei?.dt_option_simple)}
            </p>
            <p className="font-medium">
              <strong className="text-primary">Status SIMEI:</strong>{' '}
              {mostrarValor(company.simple_simei?.status_simei)}
            </p>
            <p className="font-medium">
              <strong className="text-primary">Data Opção SIMEI:</strong>{' '}
              {mostrarValor(company.simple_simei?.dt_option_simei)}
            </p>
          </div>
        </Card>
        {/* Endereços */}
        <Card title={<span className="text-primary">Endereços</span>}>
          {company.addresses && company.addresses.length > 0 ? (
            <div className="bg-gray-100 p-2 rounded-xl space-y-2">
              {company.addresses.map((addr: Address, idx: number) => (
                <div
                  key={idx}
                  className="border-b last:border-b-0 pb-2 last:pb-0"
                >
                  <div className="flex flex-wrap space-y-4 space-x-9">
                    <p className="font-medium">
                      <strong className="text-primary">Tipo:</strong>{' '}
                      {mostrarValor(addr.type)}
                    </p>
                    <p className="font-medium">
                      <strong className="text-primary">Rua:</strong>{' '}
                      {mostrarValor(addr.street)},{mostrarValor(addr.number)}
                      {addr.complement && mostrarValor(`- ${addr.complement}`)}
                    </p>
                    <p className="font-medium">
                      <strong className="text-primary">Bairro:</strong>{' '}
                      {mostrarValor(addr.neighborhood)}
                    </p>
                    <p className="font-medium">
                      <strong className="text-primary">Cidade:</strong>{' '}
                      {mostrarValor(addr.city)} - {mostrarValor(addr.district)}
                    </p>
                    <p className="font-medium">
                      <strong className="text-primary">CEP:</strong>{' '}
                      {mostrarValor(addr.postal_code)}
                    </p>
                    {addr.priority && (
                      <p className="font-medium">
                        <strong className="text-primary">Prioridade:</strong>{' '}
                        {mostrarValor(addr.priority)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-primary">Nenhum endereço cadastrado.</div>
          )}
        </Card>
        {/* Telefones Celulares */}
        <Card title={<span className="text-primary">Telefones Celulares</span>}>
          {company.mobile_phones && company.mobile_phones.length > 0 ? (
            <div className="bg-gray-100 p-2 rounded-xl space-y-2">
              {company.mobile_phones.map((phone: Phone, idx: number) => (
                <div
                  key={idx}
                  className="border-b last:border-b-0 pb-2 last:pb-0"
                >
                  <div className="flex flex-wrap space-y-4 space-x-9">
                    <p className="font-medium">
                      <strong className="text-primary">Número:</strong> (
                      {mostrarValor(phone.ddd)}){mostrarValor(phone.number)}
                    </p>
                    {phone.priority && (
                      <p className="font-medium">
                        <strong className="text-primary">Prioridade:</strong>{' '}
                        {mostrarValor(phone.priority)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-primary">Nenhum celular cadastrado.</div>
          )}
        </Card>
        {/* Telefones Fixos */}
        <Card title={<span className="text-primary">Telefones Fixos</span>}>
          {company.land_lines && company.land_lines.length > 0 ? (
            <div className="bg-gray-100 p-2 rounded-xl space-y-2">
              {company.land_lines.map((phone: Phone, idx: number) => (
                <div
                  key={idx}
                  className="border-b last:border-b-0 pb-2 last:pb-0"
                >
                  <div className="flex flex-wrap space-y-4 space-x-9">
                    <p className="font-medium">
                      <strong className="text-primary">Número:</strong> (
                      {mostrarValor(phone.ddd)}){mostrarValor(phone.number)}
                    </p>
                    {phone.priority && (
                      <p className="font-medium">
                        <strong className="text-primary">Prioridade:</strong>{' '}
                        {mostrarValor(phone.priority)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-primary">Nenhum telefone fixo cadastrado.</div>
          )}
        </Card>
        {/* E-mails da Empresa */}
        <Card title={<span className="text-primary">E-mails</span>}>
          {company.emails && company.emails.length > 0 ? (
            <div className="bg-gray-100 p-2 rounded-xl space-y-2">
              {company.emails.map((email: Email, idx: number) => (
                <div
                  key={idx}
                  className="border-b last:border-b-0 pb-2 last:pb-0"
                >
                  <div className="flex flex-wrap space-y-4 space-x-9">
                    <p className="font-medium">
                      <strong className="text-primary">E-mail:</strong>{' '}
                      {mostrarValor(email.email)}
                    </p>
                    {email.priority && (
                      <p className="font-medium">
                        <strong className="text-primary">Prioridade:</strong>{' '}
                        {mostrarValor(email.priority)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-primary">Nenhum e-mail cadastrado.</div>
          )}
        </Card>
        {/* Sócios/Representantes */}
        <Card
          title={
            <span className="text-primary">Sócios / Pessoas Relacionadas</span>
          }
        >
          {company.related_persons && company.related_persons.length > 0 ? (
            <div className="bg-gray-100 p-2 rounded-xl space-y-2">
              {company.related_persons.map(
                (person: RelatedPerson, idx: number) => (
                  <div
                    key={idx}
                    className="border-b last:border-b-0 pb-2 last:pb-0"
                  >
                    <div className="flex flex-wrap space-y-4 space-x-9">
                      <p className="font-medium">
                        <strong className="text-primary">Nome:</strong>{' '}
                        {mostrarValor(person.name)}
                      </p>
                      <div className="flex gap-2">
                        <p className="font-medium">
                          <strong className="text-primary">CPF:</strong>{' '}
                          {mostrarValor(person.cpf)}
                        </p>
                        <Link
                          href={`/take-it/view-person/${person.cpf}`}
                          className="bg-primary rounded"
                        >
                          <SearchIcon
                            color="white"
                            style={{ padding: '2px' }}
                          />
                        </Link>
                      </div>
                      <p className="font-medium">
                        <strong className="text-primary">Participação:</strong>{' '}
                        {mostrarValor(person.ownership)}
                      </p>
                      <p className="font-medium">
                        <strong className="text-primary">Descrição:</strong>{' '}
                        {mostrarValor(person.description)}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="text-primary">
              Nenhum sócio/pessoa relacionada cadastrada.
            </div>
          )}
        </Card>
        {/* Procuradores/Representantes Legais */}
        <Card
          title={
            <span className="text-primary">
              Procuradores / Representantes Legais
            </span>
          }
        >
          {company.legal_representative &&
          company.legal_representative.length > 0 ? (
            <div className="bg-gray-100 p-2 rounded-xl space-y-2">
              {company.legal_representative.map(
                (rep: LegalRepresentative, idx: number) => (
                  <div
                    key={idx}
                    className="border-b last:border-b-0 pb-2 last:pb-0"
                  >
                    <div className="flex flex-wrap space-y-4 space-x-9">
                      <p className="font-medium">
                        <strong className="text-primary">Nome:</strong>{' '}
                        {mostrarValor(rep.name)}
                      </p>
                      <div className="flex gap-2">
                        <p className="font-medium">
                          <strong className="text-primary">CPF:</strong>{' '}
                          {mostrarValor(rep.cpf)}
                        </p>

                        <Link
                          href={`/take-it/view-person/${rep.cpf}`}
                          className="bg-primary rounded"
                        >
                          <SearchIcon
                            color="white"
                            style={{ padding: '2px' }}
                          />
                        </Link>
                      </div>
                      <p className="font-medium">
                        <strong className="text-primary">Qualificação:</strong>
                        {mostrarValor(rep.qualification)}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="text-primary">Nenhum procurador cadastrado.</div>
          )}
        </Card>
        {/* Filiais */}
        <Card title={<span className="text-primary">Filiais</span>}>
          {company.branch_offices && company.branch_offices.length > 0 ? (
            <div className="bg-gray-100 p-2 rounded-xl space-y-2">
              {company.branch_offices.map(
                (branch: BranchOffice, idx: number) => (
                  <div
                    key={idx}
                    className="border-b last:border-b-0 pb-2 last:pb-0"
                  >
                    <div className="flex flex-wrap space-y-4 space-x-9">
                      <p className="font-medium">
                        <strong className="text-primary">CNPJ:</strong>{' '}
                        {mostrarValor(branch.cnpj)}
                        <Link
                          href={`/take-it/view-company/${branch.cnpj}`}
                          className="bg-primary rounded"
                        >
                          <SearchIcon
                            color="white"
                            style={{ padding: '2px' }}
                          />
                        </Link>
                      </p>
                      <p className="font-medium">
                        <strong className="text-primary">Razão Social:</strong>{' '}
                        {mostrarValor(branch.company_name)}
                      </p>
                      <p className="font-medium">
                        <strong className="text-primary">Descrição:</strong>{' '}
                        {mostrarValor(branch.ds_branch_office)}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="text-primary">Nenhuma filial cadastrada.</div>
          )}
        </Card>
        {/* Empresas Relacionadas */}
        <Card
          title={<span className="text-primary">Empresas Relacionadas</span>}
        >
          {company.related_companies && company.related_companies.length > 0 ? (
            <div className="bg-gray-100 p-2 rounded-xl space-y-2">
              {company.related_companies.map(
                (rel: RelatedCompany, idx: number) => (
                  <div
                    key={idx}
                    className="border-b last:border-b-0 pb-2 last:pb-0"
                  >
                    <div className="flex flex-wrap space-y-4 space-x-9">
                      <p className="font-medium">
                        <strong className="text-primary">Razão Social:</strong>{' '}
                        {mostrarValor(rel.name)}
                      </p>
                      <div className="flex gap-2">
                        <p className="font-medium">
                          <strong className="text-primary">CNPJ:</strong>{' '}
                          {mostrarValor(rel.cnpj)}
                        </p>
                        <Link
                          href={`/take-it/view-company/${rel.cnpj}`}
                          className="bg-primary rounded"
                        >
                          <SearchIcon
                            color="white"
                            style={{ padding: '2px' }}
                          />
                        </Link>
                      </div>
                      <p className="font-medium">
                        <strong className="text-primary">Participação:</strong>{' '}
                        {mostrarValor(rel.ownership)}
                      </p>
                      <p className="font-medium">
                        <strong className="text-primary">Descrição:</strong>{' '}
                        {mostrarValor(rel.description)}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="text-primary">
              Nenhuma empresa relacionada cadastrada.
            </div>
          )}
        </Card>
      </div>
    </div>
    //   )}
    // </TakeitLayout>
  );
};

export default ViewCompanyPage;
