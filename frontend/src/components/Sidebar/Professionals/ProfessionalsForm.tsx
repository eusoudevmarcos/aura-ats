// frontend/components/Professionals/ProfessionalsForm.tsx
import React, { useState } from "react";
import styles from "../Cards/Cards.module.css"; // Reutiliza o módulo CSS de Cards

// Definição da estrutura de dados para Áreas, Profissões e Especialidades
const AREAS_DATA = {
  Saúde: {
    Profissões: {
      Médico: [
        "Endocrinologista",
        "Obstetra",
        "Ginecologista",
        "Oncologista",
        "Cardiologista",
        "Pediatra",
        "Dermatologista",
        "Ortopedista",
        "Psiquiatra",
        "Neurologista",
      ],
      Enfermeiro: [
        "UTI",
        "Emergência",
        "Obstetrícia",
        "Pediatria",
        "Saúde Pública",
        "Centro Cirúrgico",
        "Oncologia",
      ],
      Fisioterapeuta: [
        "Ortopédica",
        "Neurológica",
        "Respiratória",
        "Esportiva",
        "Pediátrica",
      ],
      Nutricionista: ["Clínica", "Esportiva", "Saúde Pública", "Gastronomia"],
      Psicólogo: [
        "Clínica",
        "Organizacional",
        "Escolar",
        "Hospitalar",
        "Jurídica",
      ],
    },
  },
  Tecnologia: {
    Profissões: {
      "Desenvolvedor Frontend": [
        "React",
        "Angular",
        "Vue",
        "Next.js",
        "Svelte",
        "JavaScript",
        "TypeScript",
        "HTML",
        "CSS",
      ],
      "Desenvolvedor Backend": [
        "Node.js",
        "Python (Django/Flask)",
        "Java (Spring Boot)",
        "C#",
        "Go",
        "PHP (Laravel)",
        "Ruby on Rails",
      ],
      "Desenvolvedor Fullstack": [
        "React",
        "Node.js",
        "Python",
        "Java",
        "Next.js",
        "Spring Boot",
        "SQL",
        "MongoDB",
      ], // Exemplo de stacks combinadas
      "DevOps Engineer": [
        "AWS",
        "Azure",
        "GCP",
        "Docker",
        "Kubernetes",
        "CI/CD",
        "Jenkins",
        "GitLab CI",
      ],
      "QA Engineer": [
        "Testes Manuais",
        "Automação (Selenium)",
        "Cypress",
        "Playwright",
        "Performance",
      ],
      "Data Scientist": [
        "Python (Pandas, NumPy, Scikit-learn)",
        "R",
        "Machine Learning",
        "Deep Learning",
        "SQL",
      ],
      "Analista de Suporte": [
        "Redes",
        "Hardware",
        "Software",
        "Atendimento ao Cliente",
      ],
    },
  },
  Administrativa: {
    Profissões: {
      "Assistente Administrativo": [
        "Rotinas de escritório",
        "Organização",
        "Atendimento",
      ],
      "Analista Financeiro": [
        "Contas a pagar/receber",
        "Fluxo de caixa",
        "Orçamento",
      ],
      "Recursos Humanos": [
        "Recrutamento e Seleção",
        "Departamento Pessoal",
        "Treinamento e Desenvolvimento",
      ],
      "Secretária Executiva": [
        "Agendamento",
        "Comunicação",
        "Organização de eventos",
      ],
    },
  },
  Comércio: {
    Profissões: {
      Vendedor: ["Varejo", "Atacado", "Consultivo", "Online"],
      "Gerente de Loja": ["Gestão de equipe", "Estoque", "Vendas"],
      "Atendente de Loja": ["Atendimento ao cliente", "Organização"],
      "Marketing Digital": [
        "SEO",
        "SEM",
        "Mídias Sociais",
        "E-mail Marketing",
        "Conteúdo",
      ],
    },
  },
  Outras: {
    Profissões: {
      Consultor: ["Gestão", "TI", "RH", "Marketing", "Financeiro"],
      Educador: ["Ensino Fundamental", "Médio", "Superior", "Cursos Livres"],
      Artista: ["Música", "Artes Visuais", "Teatro", "Dança"],
    },
  },
};

interface ProfessionalsFormProps {
  onClose: () => void;
}

const ProfessionalsForm: React.FC<ProfessionalsFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    endereco: "",
    bairro: "",
    cidade: "",
    estado: "",
    pais: "",
    area: "",
    profissao: "",
    especialidade: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Reset profissao and especialidade if area changes
    if (name === "area") {
      setFormData((prev) => ({ ...prev, profissao: "", especialidade: "" }));
    }
    // Reset especialidade if profissao changes
    if (name === "profissao") {
      setFormData((prev) => ({ ...prev, especialidade: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você faria a chamada para a API para cadastrar o profissional
    onClose(); // Fecha o modal após o envio
  };

  const areas = Object.keys(AREAS_DATA);
  const professions = formData.area
    ? Object.keys(
        AREAS_DATA[formData.area as keyof typeof AREAS_DATA].Profissões
      )
    : [];
  // Corrigindo o erro de tipagem ao acessar especialidades
  let specialties: string[] = [];
  if (formData.area && formData.profissao) {
    const profs =
      AREAS_DATA[formData.area as keyof typeof AREAS_DATA].Profissões;
    specialties = profs[formData.profissao as keyof typeof profs] || [];
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.cardTitle}>Cadastrar Novo Profissional</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="nome" className={styles.formLabel}>
              Nome:
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              className={styles.formInput}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="cpf" className={styles.formLabel}>
              CPF (Opcional):
            </label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onChange={handleInputChange}
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="endereco" className={styles.formLabel}>
              Endereço (Opcional):
            </label>
            <input
              type="text"
              id="endereco"
              name="endereco"
              value={formData.endereco}
              onChange={handleInputChange}
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="bairro" className={styles.formLabel}>
              Bairro:
            </label>
            <input
              type="text"
              id="bairro"
              name="bairro"
              value={formData.bairro}
              onChange={handleInputChange}
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="cidade" className={styles.formLabel}>
              Cidade:
            </label>
            <input
              type="text"
              id="cidade"
              name="cidade"
              value={formData.cidade}
              onChange={handleInputChange}
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="estado" className={styles.formLabel}>
              Estado:
            </label>
            <input
              type="text"
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleInputChange}
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="pais" className={styles.formLabel}>
              País:
            </label>
            <input
              type="text"
              id="pais"
              name="pais"
              value={formData.pais}
              onChange={handleInputChange}
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="area" className={styles.formLabel}>
              Área:
            </label>
            <select
              id="area"
              name="area"
              value={formData.area}
              onChange={handleInputChange}
              className={styles.formSelect}
              required
            >
              <option value="">Selecione a Área</option>
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          {formData.area && (
            <div className={styles.formGroup}>
              <label htmlFor="profissao" className={styles.formLabel}>
                Profissão:
              </label>
              <select
                id="profissao"
                name="profissao"
                value={formData.profissao}
                onChange={handleInputChange}
                className={styles.formSelect}
                required
              >
                <option value="">Selecione a Profissão</option>
                {professions.map((prof) => (
                  <option key={prof} value={prof}>
                    {prof}
                  </option>
                ))}
              </select>
            </div>
          )}

          {formData.profissao && (
            <div className={styles.formGroup}>
              <label htmlFor="especialidade" className={styles.formLabel}>
                Especialidade:
              </label>
              <select
                id="especialidade"
                name="especialidade"
                value={formData.especialidade}
                onChange={handleInputChange}
                className={styles.formSelect}
                required
              >
                <option value="">Selecione a Especialidade</option>
                {specialties.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className={styles.formButtons}>
            <button type="submit" className={styles.submitButton}>
              Cadastrar
            </button>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfessionalsForm;
