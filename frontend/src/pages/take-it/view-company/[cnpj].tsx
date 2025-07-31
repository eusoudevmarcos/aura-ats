import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Card from "@/components/take-it/Card";
import { searchApi } from "@/axios/searchApi";

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
}

interface Phone {
  ddd?: string;
  number?: string;
}

interface Email {
  email?: string;
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
  const [loading, setLoading] = useState<boolean | null>(null);
  const router = useRouter();
  const cnpj = router.query.cnpj as string;

  const handleSearch = async (): Promise<void> => {
    setLoading(true);
    setCompany(null);

    try {
      // Passa uf dentro de options
      const data = await searchApi(cnpj || "", "companies");
      console.log(data.data);
      setCompany(data.data[0]);
    } catch (error) {
      console.error("error:" + error);
      setCompany(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  });

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Carregando</div>;
  }

  if (!company) {
    return (
      <div className="p-8 text-center text-gray-500">
        Nenhum dado disponível para exibir.
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 rounded-xl shadow-lg">
      <button onClick={() => router.back()} className="mb-4 text-blue-600">
        Voltar
      </button>
      <h1 className="text-2xl mb-4 font-black">{company.company_name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dados da Empresa */}
        <Card title="Dados da Empresa" className="col-start-1 col-end-3">
          <div className="flex flex-wrap space-y-4 space-x-9">
            <p className="font-medium">
              <strong>CNPJ:</strong> {company.cnpj}
            </p>
            <p className="font-medium">
              <strong>Nome Fantasia:</strong> {company.trading_name}
            </p>
            <p className="font-medium">
              <strong>Data de Abertura:</strong> {company.creation_date}
            </p>
            <p className="font-medium">
              <strong>Receita Estimada:</strong> {company.estimated_revenue}
            </p>
            <p className="font-medium">
              <strong>Capital Social:</strong> {company.share_capital}
            </p>
            <p className="font-medium">
              <strong>Cidade/UF:</strong> {company.city_uf}
            </p>
            <p className="font-medium">
              <strong>Segmento:</strong> {company.segment}
            </p>
            <p className="font-medium">
              <strong>Idade:</strong> {company.age}
            </p>
            <p className="font-medium">
              <strong>Funcionários:</strong> {company.employee_count}
            </p>
            <p className="font-medium">
              <strong>Tipo de Matriz:</strong> {company.headquarter_type}
            </p>
            <p className="font-medium">
              <strong>Porte:</strong> {company.business_size}
            </p>
            <p className="font-medium">
              <strong>Situação Cadastral:</strong> {company.registry_situation}
            </p>
            <p className="font-medium">
              <strong>CNAE:</strong> {company.cnae_code} -{" "}
              {company.cnae_description}
            </p>
            <p className="font-medium">
              <strong>Tipo Jurídico:</strong> {company.juridical_type}
            </p>
          </div>
        </Card>

        {/* Endereços */}
        <Card title="Endereços">
          {company.addresses && company.addresses.length > 0 ? (
            <div className="space-y-2">
              {company.addresses.map((addr, i) => (
                <div
                  key={i}
                  className="border-b last:border-b-0 pb-2 last:pb-0"
                >
                  <div className="flex flex-wrap space-y-4 space-x-9">
                    <p className="font-medium">
                      <strong>Tipo:</strong> {addr.type}
                    </p>
                    <p className="font-medium">
                      <strong>Rua:</strong> {addr.street}, {addr.number}{" "}
                      {addr.complement && `- ${addr.complement}`}
                    </p>
                    <p className="font-medium">
                      <strong>Bairro:</strong> {addr.neighborhood}
                    </p>
                    <p className="font-medium">
                      <strong>Cidade:</strong> {addr.city} - {addr.district}
                    </p>
                    <p className="font-medium">
                      <strong>CEP:</strong> {addr.postal_code}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>Nenhum endereço cadastrado.</div>
          )}
        </Card>

        {/* Contatos */}
        <Card title="Contatos">
          <div className="mb-2">
            <strong>Celulares:</strong>
            {company.mobile_phones && company.mobile_phones.length > 0 ? (
              company.mobile_phones.map((m, i) => (
                <div key={i}>
                  ({m.ddd}) {m.number}
                </div>
              ))
            ) : (
              <div>Nenhum celular cadastrado.</div>
            )}
          </div>
          <div className="mb-2">
            <strong>Fixos:</strong>
            {company.land_lines && company.land_lines.length > 0 ? (
              company.land_lines.map((l, i) => (
                <div key={i}>
                  ({l.ddd}) {l.number}
                </div>
              ))
            ) : (
              <div>Nenhum telefone fixo cadastrado.</div>
            )}
          </div>
          <div>
            <strong>E-mails:</strong>
            {company.emails && company.emails.length > 0 ? (
              company.emails.map((e, i) => <div key={i}>{e.email}</div>)
            ) : (
              <div>Nenhum e-mail cadastrado.</div>
            )}
          </div>
        </Card>

        {/* Sócios/Relacionados */}
        <Card title="Sócios/Relacionados">
          {company.related_persons && company.related_persons.length > 0 ? (
            <div className="space-y-2">
              {company.related_persons.map((p, i) => (
                <div
                  key={i}
                  className="border-b last:border-b-0 pb-2 last:pb-0"
                >
                  <div className="flex flex-wrap space-y-4 space-x-9">
                    <p className="font-medium">
                      <strong>Nome:</strong> {p.name}
                    </p>
                    <p className="font-medium">
                      <strong>CPF:</strong> {p.cpf}
                    </p>
                    <p className="font-medium">
                      <strong>Descrição:</strong> {p.description}
                    </p>
                    <p className="font-medium">
                      <strong>Participação:</strong> {p.ownership}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>Nenhum sócio/relacionado cadastrado.</div>
          )}
        </Card>

        {/* Representantes Legais */}
        <Card title="Representantes Legais">
          {company.legal_representative &&
          company.legal_representative.length > 0 ? (
            <div className="space-y-2">
              {company.legal_representative.map((r, i) => (
                <div
                  key={i}
                  className="border-b last:border-b-0 pb-2 last:pb-0"
                >
                  <div className="flex flex-wrap space-y-4 space-x-9">
                    <p className="font-medium">
                      <strong>Nome:</strong> {r.name}
                    </p>
                    <p className="font-medium">
                      <strong>CPF:</strong> {r.cpf}
                    </p>
                    <p className="font-medium">
                      <strong>Qualificação:</strong> {r.qualification}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>Nenhum representante legal cadastrado.</div>
          )}
        </Card>

        {/* Filiais */}
        <Card title="Filiais">
          {company.branch_offices && company.branch_offices.length > 0 ? (
            <div className="space-y-2">
              {company.branch_offices.map((b, i) => (
                <div
                  key={i}
                  className="border-b last:border-b-0 pb-2 last:pb-0"
                >
                  <div className="flex flex-wrap space-y-4 space-x-9">
                    <p className="font-medium">
                      <strong>Razão Social:</strong> {b.company_name}
                    </p>
                    <p className="font-medium">
                      <strong>CNPJ:</strong> {b.cnpj}
                    </p>
                    <p className="font-medium">
                      <strong>Descrição:</strong> {b.ds_branch_office}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>Nenhuma filial cadastrada.</div>
          )}
        </Card>

        {/* Empresas Relacionadas */}
        <Card title="Empresas Relacionadas">
          {company.related_companies && company.related_companies.length > 0 ? (
            <div className="space-y-2">
              {company.related_companies.map((c, i) => (
                <div
                  key={i}
                  className="border-b last:border-b-0 pb-2 last:pb-0"
                >
                  <div className="flex flex-wrap space-y-4 space-x-9">
                    <p className="font-medium">
                      <strong>Nome:</strong> {c.name}
                    </p>
                    <p className="font-medium">
                      <strong>CNPJ:</strong> {c.cnpj}
                    </p>
                    <p className="font-medium">
                      <strong>Descrição:</strong> {c.description}
                    </p>
                    <p className="font-medium">
                      <strong>Participação:</strong> {c.ownership}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>Nenhuma empresa relacionada cadastrada.</div>
          )}
        </Card>

        {/* E-mails Relacionados */}
        <Card title="E-mails Relacionados">
          {company.related_emails && company.related_emails.length > 0 ? (
            <div className="space-y-2">
              {company.related_emails.map((e, i) => (
                <div key={i}>{e.email}</div>
              ))}
            </div>
          ) : (
            <div>Nenhum e-mail relacionado cadastrado.</div>
          )}
        </Card>

        {/* Simples/SIMEI */}
        <Card title="Simples/SIMEI">
          {company.simple_simei ? (
            <div className="flex flex-wrap space-y-4 space-x-9">
              <p className="font-medium">
                <strong>Status Simples:</strong>{" "}
                {company.simple_simei.status_simple}
              </p>
              <p className="font-medium">
                <strong>Data Opção Simples:</strong>{" "}
                {company.simple_simei.dt_option_simple}
              </p>
              <p className="font-medium">
                <strong>Status SIMEI:</strong>{" "}
                {company.simple_simei.status_simei}
              </p>
              <p className="font-medium">
                <strong>Data Opção SIMEI:</strong>{" "}
                {company.simple_simei.dt_option_simei}
              </p>
            </div>
          ) : (
            <div>Sem informações de Simples/SIMEI.</div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ViewCompanyPage;
