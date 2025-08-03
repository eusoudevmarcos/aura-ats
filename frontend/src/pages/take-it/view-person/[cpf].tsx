import React from "react";
import Card from "@/components/takeit/Card";
import { searchApi } from "@/axios/searchApi";
import { useRouter } from "next/router";
import Link from "next/link";
import TakeitLayout from "@/layout/takeitLayout";
import style from "@/styles/takeit.module.scss";

function mostrarValor(valor: any): string {
  if (
    valor === null ||
    valor === undefined ||
    (typeof valor === "string" && valor.trim() === "")
  ) {
    return "N/A";
  }
  return valor;
}

type Props = {
  data: data;
};

interface data {
  name?: string;
  cpf?: string;
  rg?: string;
  gender?: string;
  birthday?: string;
  mother_name?: string;
  possibly_dead?: boolean | null;
  retired?: boolean | null;
  bolsa_familia?: boolean | null;
  cbo_code?: string;
  cbo_description?: string;
  estimated_income?: string;
  pep?: boolean | null;
  pep_type?: string;
  addresses?: Address[];
  mobile_phones?: Phone[];
  land_lines?: Phone[];
  emails?: Email[];
  family_datas?: Familydata[];
  related_companies?: RelatedCompany[];
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
  cdr_datetime?: string;
  hot_datetime?: string;
  whatsapp_datetime?: string;
  cpc_datetime?: string;
}

interface Email {
  email?: string;
  priority?: string;
}

interface Familydata {
  name?: string;
  cpf?: string;
  description?: string;
}

interface RelatedCompany {
  cnpj?: string;
  company_name?: string;
  trading_name?: string;
  registry_situation?: string;
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true, // permite gerar páginas sob demanda
  };
}

export async function getStaticProps(context: any) {
  const cpf = context.params?.cpf ?? null;

  if (!cpf) {
    return { notFound: true };
  }

  try {
    const response = await searchApi(cpf, "persons");
    return {
      props: { data: response.data[0] || null },
      revalidate: 60,
    };
  } catch (error: any) {
    console.log(error);

    return {
      props: { data: null },
      // ou: notFound: true se quiser redirecionar para 404
    };
  }
}

export default function ViewdataPage({ data }: Props): React.ReactElement {
  const router = useRouter();

  if (router.isFallback) {
    return <div className="p-8 text-center text-gray-500">Carregando</div>;
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-gray-500">
        Nenhum dado disponível para exibir.
      </div>
    );
  }

  return (
    <TakeitLayout fit>
      {({}) => (
        <>
          <button onClick={() => router.back()} className={style.buttonPrimary}>
            Voltar
          </button>
          <h1 className="text-2xl mb-4 font-black">
            Nome: {mostrarValor(data.name)}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dados Pessoais */}
            <Card title="Dados Pessoais" className={"col-start-1 col-end-3"}>
              <div className="flex flex-wrap space-y-4 space-x-9">
                <p className="font-medium">
                  <strong>CPF:</strong> {mostrarValor(data.cpf)}
                </p>
                <p className="font-medium">
                  <strong>RG:</strong> {mostrarValor(data.rg)}
                </p>
                <p className="font-medium">
                  <strong>Sexo:</strong>{" "}
                  {data.gender === "F"
                    ? "Feminino"
                    : data.gender === "M"
                    ? "Masculino"
                    : "N/A"}
                </p>
                <p className="font-medium">
                  <strong>Data de Nascimento:</strong>{" "}
                  {mostrarValor(data.birthday)}
                </p>
                <p className="font-medium">
                  <strong>Nome da Mãe:</strong> {mostrarValor(data.mother_name)}
                </p>
                <p className="font-medium">
                  <strong>Falecido:</strong>{" "}
                  {data.possibly_dead === null ||
                  data.possibly_dead === undefined
                    ? "N/A"
                    : data.possibly_dead
                    ? "Sim"
                    : "Não"}
                </p>
                <p className="font-medium">
                  <strong>Aposentado:</strong>{" "}
                  {data.retired === null || data.retired === undefined
                    ? "N/A"
                    : data.retired
                    ? "Sim"
                    : "Não"}
                </p>
                <p className="font-medium">
                  <strong>Bolsa Família:</strong>{" "}
                  {data.bolsa_familia === null ||
                  data.bolsa_familia === undefined
                    ? "N/A"
                    : data.bolsa_familia
                    ? "Sim"
                    : "Não"}
                </p>
              </div>
            </Card>
            {/* Profissão e Renda */}
            <Card title="Profissão e Renda">
              <div className="flex flex-wrap space-y-4 space-x-9">
                <p className="font-medium">
                  <strong>CBO:</strong> {mostrarValor(data.cbo_code)} -{" "}
                  {mostrarValor(data.cbo_description)}
                </p>
                <p className="font-medium">
                  <strong>Renda Estimada:</strong>{" "}
                  {mostrarValor(data.estimated_income)}
                </p>
              </div>
            </Card>
            {/* PEP */}
            <Card title="Pessoa Politicamente Exposta (PEP)">
              <div className="flex flex-wrap space-y-4 space-x-9">
                <p className="font-medium">
                  <strong>PEP:</strong>{" "}
                  {data.pep === null || data.pep === undefined
                    ? "N/A"
                    : data.pep
                    ? "Sim"
                    : "Não"}
                </p>
                {data.pep && (
                  <p className="font-medium">
                    <strong>Tipo de PEP:</strong> {mostrarValor(data.pep_type)}
                  </p>
                )}
              </div>
            </Card>
            {/* Endereços */}
            <Card title="Endereços">
              {data.addresses && data.addresses.length > 0 ? (
                <div className="space-y-2">
                  {data.addresses.map((addr: any, idx: any) => (
                    <div
                      key={idx}
                      className="border-b last:border-b-0 pb-2 last:pb-0"
                    >
                      <div className="flex flex-wrap space-y-4 space-x-9">
                        <p className="font-medium">
                          <strong>Tipo:</strong> {mostrarValor(addr.type)}
                        </p>
                        <p className="font-medium">
                          <strong>Rua:</strong> {mostrarValor(addr.street)},{" "}
                          {mostrarValor(addr.number)}{" "}
                          {addr.complement &&
                            mostrarValor(`- ${addr.complement}`)}
                        </p>
                        <p className="font-medium">
                          <strong>Bairro:</strong>{" "}
                          {mostrarValor(addr.neighborhood)}
                        </p>
                        <p className="font-medium">
                          <strong>Cidade:</strong> {mostrarValor(addr.city)} -{" "}
                          {mostrarValor(addr.district)}
                        </p>
                        <p className="font-medium">
                          <strong>CEP:</strong> {mostrarValor(addr.postal_code)}
                        </p>
                        <p className="font-medium">
                          <strong>Prioridade:</strong>{" "}
                          {mostrarValor(addr.priority)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>Nenhum endereço cadastrado.</div>
              )}
            </Card>
            {/* Telefones Celulares */}
            <Card title="Telefones Celulares">
              {data.mobile_phones && data.mobile_phones.length > 0 ? (
                <div className="space-y-2">
                  {data.mobile_phones.map((phone: any, idx: any) => (
                    <div
                      key={idx}
                      className="border-b last:border-b-0 pb-2 last:pb-0"
                    >
                      <div className="flex flex-wrap space-y-4 space-x-9">
                        <p className="font-medium">
                          <strong>Número:</strong> ({mostrarValor(phone.ddd)}){" "}
                          {mostrarValor(phone.number)}
                        </p>
                        <p className="font-medium">
                          <strong>Prioridade:</strong>{" "}
                          {mostrarValor(phone.priority)}
                        </p>
                        <p className="font-medium">
                          <strong>Data CDR:</strong>{" "}
                          {mostrarValor(phone.cdr_datetime)}
                        </p>
                        <p className="font-medium">
                          <strong>Data Hot:</strong>{" "}
                          {mostrarValor(phone.hot_datetime)}
                        </p>
                        <p className="font-medium">
                          <strong>WhatsApp:</strong>{" "}
                          {mostrarValor(phone.whatsapp_datetime)}
                        </p>
                        <p className="font-medium">
                          <strong>CPC:</strong>{" "}
                          {mostrarValor(phone.cpc_datetime)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>Nenhum celular cadastrado.</div>
              )}
            </Card>
            {/* Telefones Fixos */}
            <Card title="Telefones Fixos">
              {data.land_lines && data.land_lines.length > 0 ? (
                <div className="space-y-2">
                  {data.land_lines.map((phone: any, idx: any) => (
                    <div
                      key={idx}
                      className="border-b last:border-b-0 pb-2 last:pb-0"
                    >
                      <div className="flex flex-wrap space-y-4 space-x-9">
                        <p className="font-medium">
                          <strong>Número:</strong> ({mostrarValor(phone.ddd)}){" "}
                          {mostrarValor(phone.number)}
                        </p>
                        <p className="font-medium">
                          <strong>Prioridade:</strong>{" "}
                          {mostrarValor(phone.priority)}
                        </p>
                        <p className="font-medium">
                          <strong>Data CDR:</strong>{" "}
                          {mostrarValor(phone.cdr_datetime)}
                        </p>
                        <p className="font-medium">
                          <strong>Data Hot:</strong>{" "}
                          {mostrarValor(phone.hot_datetime)}
                        </p>
                        <p className="font-medium">
                          <strong>WhatsApp:</strong>{" "}
                          {mostrarValor(phone.whatsapp_datetime)}
                        </p>
                        <p className="font-medium">
                          <strong>CPC:</strong>{" "}
                          {mostrarValor(phone.cpc_datetime)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>Nenhum telefone fixo cadastrado.</div>
              )}
            </Card>
            {/* E-mails */}
            <Card title="E-mails">
              {data.emails && data.emails.length > 0 ? (
                <div className="space-y-2">
                  {data.emails.map((email: any, idx: any) => (
                    <div
                      key={idx}
                      className="border-b last:border-b-0 pb-2 last:pb-0"
                    >
                      <div className="flex flex-wrap space-y-4 space-x-9">
                        <p className="font-medium">
                          <strong>E-mail:</strong> {mostrarValor(email.email)}
                        </p>
                        <p className="font-medium">
                          <strong>Prioridade:</strong>{" "}
                          {mostrarValor(email.priority)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>Nenhum e-mail cadastrado.</div>
              )}
            </Card>
            {/* Familiares */}
            <Card title="Familiares">
              {data.family_datas && data.family_datas.length > 0 ? (
                <div className="space-y-2">
                  {data.family_datas.map((fam: any, idx: any) => (
                    <div
                      key={idx}
                      className="border-b last:border-b-0 pb-2 last:pb-0"
                    >
                      <div className="flex flex-wrap space-y-4 space-x-9">
                        <p className="font-medium">
                          <strong>Nome:</strong> {mostrarValor(fam.name)}
                        </p>
                        <p className="font-medium">
                          <strong>CPF:</strong> {mostrarValor(fam.cpf)}
                        </p>
                        <p className="font-medium">
                          <strong>Descrição:</strong>{" "}
                          {mostrarValor(fam.description)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>Nenhum familiar cadastrado.</div>
              )}
            </Card>
            {/* Empresas Relacionadas */}
            <Card title="Empresas Relacionadas">
              {data.related_companies && data.related_companies.length > 0 ? (
                <div className="space-y-2">
                  {data.related_companies.map((company: any, idx: any) => (
                    <div
                      key={idx}
                      className="border-b last:border-b-0 pb-2 last:pb-0"
                    >
                      <div className="flex flex-wrap space-y-4 space-x-9">
                        <div className="flex gap-2">
                          <p className="font-medium">
                            <strong>CNPJ:</strong> {mostrarValor(company.cnpj)}{" "}
                          </p>
                          <Link
                            href={`/take-it/view-company/${company.cnpj}`}
                            className="bg-[#48038a] rounded"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="24px"
                              viewBox="0 -960 960 960"
                              width="24px"
                              fill="#fff"
                            >
                              <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                            </svg>
                          </Link>
                        </div>

                        <p className="font-medium">
                          <strong>Razão Social:</strong>{" "}
                          {mostrarValor(company.company_name)}
                        </p>
                        <p className="font-medium">
                          <strong>Nome Fantasia:</strong>{" "}
                          {mostrarValor(company.trading_name)}
                        </p>
                        <p className="font-medium">
                          <strong>Situação Cadastral:</strong>{" "}
                          {mostrarValor(company.registry_situation)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>Nenhuma empresa relacionada cadastrada.</div>
              )}
            </Card>
          </div>
        </>
      )}
    </TakeitLayout>
  );
}
