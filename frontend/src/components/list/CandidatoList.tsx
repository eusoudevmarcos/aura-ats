import React, { useState, useEffect } from "react";
import Table, { TableColumn } from "../Table"; // Certifique-se que o caminho está correto
import api from "@/axios";
import { Pagination } from "@/type/pagination.type"; // Se este é o seu tipo de paginação
import { useRouter } from "next/router";
import { ContatoInput } from "@/schemas/contato.schema";
import { Pessoa } from "@/type/pessoa.type";
import { Candidato } from "@/type/candidato.type";
import { Especialidade } from "@/type/especialidade.type";
import Card from "../Card";

type CandidatoWithRelations = Candidato & {
  pessoa: Pessoa & {
    contatos?: ContatoInput[];
  };
  especialidade?: Especialidade | null;
};

const columns: TableColumn<CandidatoWithRelations>[] = [
  {
    label: "Nome",
    key: "pessoa.nome",
    render: (value, row) => row.pessoa?.nome || "N/A",
  },
  {
    label: "Email",
    key: "pessoa.contatos[0].email",
    render: (value, row) => row.pessoa?.contatos?.[0]?.email || "N/A",
  },
  { label: "Área Candidato", key: "areaCandidato" },
  {
    label: "Data de Nascimento",
    key: "pessoa.dataNascimento",
    render: (value, row) => {
      return row.pessoa?.dataNascimento
        ? new Date(row.pessoa.dataNascimento).toLocaleDateString("pt-BR")
        : "N/A";
    },
  },
  {
    label: "CPF",
    key: "pessoa.cpf",
    render: (value, row) => row.pessoa?.cpf || "N/A",
  },
  { label: "CRM", key: "crm" },
  { label: "COREN", key: "corem" },
  { label: "RQE", key: "rqe" },
  {
    label: "Especialidade",
    key: "especialidade.nome",
    render: (_, row) => row.especialidade?.nome || "N/A",
  },
];

const CandidatoList: React.FC = () => {
  const [search, setSearch] = useState("");
  const [candidatos, setCandidatos] = useState<CandidatoWithRelations[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  const router = useRouter();

  useEffect(() => {
    const fetchCandidatos = async () => {
      setLoading(true);
      try {
        const response = await api.get<Pagination<CandidatoWithRelations[]>>(
          "/api/candidato",
          {
            params: {
              page,
              pageSize,
              search,
            },
          }
        );
        console.log("Dados recebidos da API:", response.data.data);
        setCandidatos(response.data.data);
        setTotal(response.data.total);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Erro ao buscar candidatos:", error);
        setCandidatos([]);
        setTotal(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidatos();
  }, [page, pageSize, search]);

  const dadosTabela = candidatos;

  const dadosFiltrados = dadosTabela.filter(
    (c) =>
      c.pessoa?.nome?.toLowerCase().includes(search.toLowerCase()) ||
      c.pessoa?.contatos?.[0]?.email
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      c.areaCandidato?.toLowerCase().includes(search.toLowerCase()) ||
      c.pessoa?.cpf?.toLowerCase().includes(search.toLowerCase())
  );

  const onRowClick = (row: CandidatoWithRelations) => {
    router.push(`/candidato/${row.id}`);
  };

  return (
    <Card classNameContainer="mt-6 px-6 py-8">
      <div className="flex justify-between p-2">
        <h2 className="text-xl font-bold mb-4">Lista de Candidatos</h2>
        <input
          type="text"
          placeholder="Buscar cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow w-full max-w-[300px] px-3 py-2 rounded-lg border border-gray-200 outline-none"
        />
      </div>
      <input
        type="text"
        placeholder="Buscar por nome, email, área ou CPF..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-full max-w-md"
      />
      <Table
        data={search ? dadosFiltrados : dadosTabela}
        columns={columns}
        loading={loading}
        emptyMessage="Nenhum candidato encontrado."
        onRowClick={onRowClick}
        pagination={{
          page,
          pageSize,
          total,
          totalPages,
          onPageChange: (p: number) => setPage(p),
        }}
      />
    </Card>
  );
};

export default CandidatoList;
