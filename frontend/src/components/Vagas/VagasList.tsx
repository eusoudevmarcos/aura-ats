// frontend/components/Vagas/VagasList.tsx
import React, { useState } from "react";
import styles from "./Vagas.module.css"; // Importa o módulo CSS específico de Vagas

interface Vaga {
  id: string;
  title: string;
  company: string;
  location: string;
  status: "open" | "closed" | "hiring";
  applicants: number;
}

const VagasList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  // Dados mockados: Em um projeto real, estes viriam do seu backend (API)
  const vagas: Vaga[] = [
    {
      id: "v1",
      title: "Desenvolvedor Frontend Sênior",
      company: "Tech Solutions",
      location: "São Paulo, SP",
      status: "hiring",
      applicants: 15,
    },
    {
      id: "v2",
      title: "Analista de Marketing Digital",
      company: "Creative Minds",
      location: "Rio de Janeiro, RJ",
      status: "open",
      applicants: 8,
    },
    {
      id: "v3",
      title: "Gerente de Projetos",
      company: "Global Corp",
      location: "Remoto",
      status: "closed",
      applicants: 20,
    },
    {
      id: "v4",
      title: "UX/UI Designer Júnior",
      company: "Design Studio",
      location: "Belo Horizonte, MG",
      status: "open",
      applicants: 12,
    },
  ];

  const filteredVagas = vagas.filter(
    (vaga) =>
      vaga.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vaga.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vaga.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className={styles.vagasHeader}>
        <h3 className={styles.vagasTitle}>Lista de Vagas</h3>
        <input
          type="text"
          placeholder="Buscar vaga..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.vagasSearchInput}
        />
      </div>
      <table className={styles.vagasTable}>
        <thead>
          <tr>
            <th>Título da Vaga</th>
            <th>Empresa</th>
            <th>Localização</th>
            <th>Status</th>
            <th>Candidatos</th>
          </tr>
        </thead>
        <tbody>
          {filteredVagas.map((vaga) => (
            <tr key={vaga.id}>
              <td>{vaga.title}</td>
              <td>{vaga.company}</td>
              <td>{vaga.location}</td>
              <td>
                <span className={`${styles.statusPill} ${styles[vaga.status]}`}>
                  {vaga.status === "open"
                    ? "Aberta"
                    : vaga.status === "closed"
                    ? "Fechada"
                    : "Contratando"}
                </span>
              </td>
              <td>{vaga.applicants}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredVagas.length === 0 && (
        <p style={{ textAlign: "center", marginTop: "20px", color: "#6b7280" }}>
          Nenhuma vaga encontrada.
        </p>
      )}
    </>
  );
};

export default VagasList;
