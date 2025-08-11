// frontend/components/Clients/ClientList.tsx
import React, { useEffect, useMemo, useState } from "react";
import styles from "./Clients.module.css";
import api from "@/axios";
import Table, { TableColumn } from "../Table";
import { useRouter } from "next/router";
import { Pagination } from "@/model/pagination.model";

interface EmpresaContato {
  telefone?: string;
  whatsapp?: string;
  email?: string;
}
interface EmpresaLocalizacao {
  cidade: string;
  estado: string;
}
interface Empresa {
  id: string;
  razaoSocial: string;
  cnpj: string;
  dataAbertura?: string;
  contatos?: EmpresaContato[];
  localizacoes?: EmpresaLocalizacao[];
}
interface Cliente {
  id: string;
  tipoServico: string[];
  empresa: Empresa;
  status: string;
}

function normalizarTable(clientes: Cliente[]) {
  return clientes.map((c) => ({
    id: c.id,
    nome: c.empresa?.razaoSocial ?? "-",
    email: c.empresa?.contatos?.[0]?.email ?? "-",
    cnpj: c.empresa?.cnpj ?? "-",
    dataAbertura: c.empresa?.dataAbertura
      ? new Date(c.empresa.dataAbertura).toLocaleDateString("pt-BR")
      : "-",
    servicos: Array.isArray(c.tipoServico)
      ? c.tipoServico.join(", ")
      : String(c.tipoServico ?? "-"),
    status: c.status,
  }));
}

const ClientList: React.FC = () => {
  const [search, setSearch] = useState("");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Paginação (ajuste quando backend suportar paginação de clientes)
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  const router = useRouter();

  useEffect(() => {
    const fetchClientes = async () => {
      setLoading(true);
      try {
        const response = await api.get<Pagination<Cliente[]>>("/api/cliente");
        const data = Array.isArray(response.data?.data)
          ? response.data.data
          : [];
        setClientes(data);
        setTotal(data.length);
        setTotalPages(Math.max(1, Math.ceil(data.length / pageSize)));
      } catch (error) {
        setClientes([]);
        setTotal(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchClientes();
  }, []);

  const dadosTabela = useMemo(() => normalizarTable(clientes), [clientes]);

  const dadosFiltrados = useMemo(() => {
    const s = search.toLowerCase();
    return dadosTabela.filter((c: any) =>
      [c.nome, c.email, c.cnpj, c.servicos, c.status]
        .filter(Boolean)
        .some((v: string) => String(v).toLowerCase().includes(s))
    );
  }, [dadosTabela, search]);

  const columns: TableColumn<any>[] = [
    { label: "Nome", key: "nome" },
    { label: "Email", key: "email" },
    { label: "CNPJ", key: "cnpj" },
    { label: "Abertura", key: "dataAbertura" },
    { label: "Serviços", key: "servicos" },
    { label: "Status", key: "status" },
  ];

  const onRowClick = (row: any) => {
    router.push(`/cliente/${row.id}`);
  };

  return (
    <div className={styles.clientsSection}>
      <div className={styles.clientsHeader}>
        <h3 className={styles.clientsTitle}>Lista de Clientes</h3>
        <input
          type="text"
          placeholder="Buscar cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.clientsSearchInput}
        />
      </div>
      <Table
        columns={columns}
        data={dadosFiltrados}
        loading={loading}
        emptyMessage="Nenhum cliente encontrado."
        pagination={{
          page,
          pageSize,
          total,
          totalPages,
          onPageChange: setPage,
        }}
        onRowClick={onRowClick}
      />
    </div>
  );
};

export default ClientList;
