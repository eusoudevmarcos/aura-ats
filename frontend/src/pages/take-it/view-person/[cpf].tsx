import React, { useState, useRef, useEffect } from "react";
import Card from "@/components/takeit/Card";
import { searchApi } from "@/axios/searchApi";
import { useRouter } from "next/router";
import Link from "next/link";
import TakeitLayout from "@/layout/takeitLayout";
import { exportToCSV, exportToPDF, mostrarValor } from "@/utils/exportCSV";

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
    return {
      props: { data: null },
    };
  }
}

export default function ViewPersonPage({ data }: any): React.ReactElement {
  const router = useRouter();
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Função para exportar
  const handleExport = async (type: "csv" | "pdf") => {
    setShowExportDropdown(false);
    if (type === "csv") {
      exportToCSV(data);
    } else if (type === "pdf") {
      await exportToPDF(cardRef as React.RefObject<HTMLDivElement>);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        showExportDropdown &&
        !(event.target as HTMLElement).closest("#export-dropdown") &&
        !(event.target as HTMLElement).closest("#export-btn")
      ) {
        setShowExportDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showExportDropdown]);

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
        <div>
          <div className="flex justify-between mb-10 px-4 py-2">
            <button
              onClick={() => router.push("/take-it")}
              className="buttonPrimary"
            >
              Voltar
            </button>

            <div className="relative inline-block" id="export-dropdown">
              <button
                id="export-btn"
                className="buttonPrimary flex items-center"
                onClick={() => setShowExportDropdown((prev) => !prev)}
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
                    onClick={() => handleExport("csv")}
                  >
                    Exportar CSV
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => handleExport("pdf")}
                  >
                    Exportar PDF
                  </button>
                </div>
              )}
            </div>
          </div>
          <h1 className="text-2xl mb-4 font-black">
            Nome: {mostrarValor(data.name)}
          </h1>
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            id="card"
            ref={cardRef}
          >
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
        </div>
      )}
    </TakeitLayout>
  );
}
