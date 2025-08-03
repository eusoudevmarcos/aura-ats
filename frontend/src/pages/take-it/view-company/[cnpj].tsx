import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Card from "@/components/takeit/Card";
import { searchApi } from "@/axios/searchApi";
import { exportToCSV, exportToPDF } from "@/utils/exportCSV";

interface Company {
  // ... interfaces iguais às que você já tem
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
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const router = useRouter();
  const cnpj = router.query.cnpj as string;
  const cardRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (): Promise<void> => {
    setLoading(true);
    setCompany(null);

    try {
      const data = await searchApi(cnpj || "", "companies");
      setCompany(data.data[0]);
    } catch (error) {
      console.error("error:" + error);
      setCompany(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cnpj) {
      handleSearch();
    }
  }, [cnpj]);

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

  const handleExport = async (type: "csv" | "pdf") => {
    setShowExportDropdown(false);
    if (!company) return;

    if (type === "csv") {
      exportToCSV(company);
    } else if (type === "pdf") {
      await exportToPDF(cardRef as React.RefObject<HTMLDivElement>);
    }
  };

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
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => router.back()} className="buttonPrimary">
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
            <div className="absolute right-0 z-10 mt-2 w-36 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
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

      <h1 className="text-2xl mb-4 font-black">{company.company_name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" ref={cardRef}>
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

        {/* Os outros cards continuam iguais, omitidos para brevidade */}
        {/* ... */}
      </div>
    </div>
  );
};

export default ViewCompanyPage;
