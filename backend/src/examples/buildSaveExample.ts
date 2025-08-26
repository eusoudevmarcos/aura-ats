import { save } from "../helper/buildSave";
import { RelationConfig } from "../types/buildSave";

/**
 * Exemplos de uso do sistema flexível de buildSave com o schema correto
 */

// Exemplo 1: Vaga com todas as relações (baseado no seu JSON)
export async function exemploVagaCompleta(prisma: any, tx: any) {
  const vagaData = {
    titulo: "Desenvolvedor Fullstack Sênior",
    descricao:
      "Procuramos um desenvolvedor Fullstack experiente com foco em Node.js e React.",
    requisitos:
      "Experiência em APIs REST, bancos de dados SQL/NoSQL, e metodologias ágeis.",
    responsabilidades:
      "Desenvolver e manter aplicações, participar de revisões de código, colaborar com equipes multifuncionais.",
    salario: 8500.0,
    tipoSalario: "mensal",
    dataFechamento: "2025-12-31T23:59:59.000Z",
    categoria: "TECNOLOGIA",
    status: "ATIVA",
    tipoContrato: "CLT",
    nivelExperiencia: "SENIOR",
    areaCandidato: "MEDICINA",
    clienteId: "clg4n7w6s0000r4w3e9f4a0c8",

    // Relação one-to-one
    localizacao: {
      cep: "01001-000",
      cidade: "São Paulo",
      bairro: "Sé",
      uf: "SP",
      estado: "São Paulo",
      complemento: "Edifício X",
      logradouro: "Praça da Sé",
      regiao: "Sudeste",
    },

    // Relação one-to-many (Beneficio tem vagaId)
    beneficios: [
      {
        nome: "Vale Refeição",
        descricao: "R$ 40,00 por dia",
      },
      {
        nome: "Plano de Saúde",
        descricao: "Amil - Apartamento",
      },
    ],

    // Relação many-to-many (via VagaHabilidade)
    habilidades: [
      {
        nome: "JavaScript",
        tipoHabilidade: "LINGUAGEM",
        nivelExigido: "AVANCADO",
      },
      {
        nome: "React",
        tipoHabilidade: "FRAMEWORK",
        nivelExigido: "INTERMEDIARIO",
      },
    ],

    // Relação many-to-many (via VagaAnexo)
    anexos: [
      {
        anexoId: "clg4n7w6s0003r4w3e9f4a0c1",
      },
    ],
  };

  const relations: Record<string, RelationConfig> = {
    localizacao: {
      type: "one-to-one",
      validation: {
        uniqueKeys: ["cidade", "uf"],
      },
    },
    beneficios: {
      type: "one-to-many",
      validation: {
        uniqueKeys: ["nome"],
      },
    },
    habilidades: {
      type: "many-to-many",
      validation: {
        uniqueKeys: ["nome"],
      },
    },
    anexos: {
      type: "many-to-many",
      validation: {
        uniqueKeys: ["anexoId"],
      },
    },
  };

  return await save({
    prisma,
    tx,
    model: "vaga",
    data: vagaData,
    relations,
    include: {
      localizacao: true,
      beneficios: true,
      habilidades: true,
      anexos: true,
      cliente: true,
    },
  });
}

// Exemplo 2: Apenas conectar registros existentes
export async function exemploApenasConectar(prisma: any, tx: any) {
  const vagaData = {
    titulo: "Designer UX/UI",
    descricao: "Vaga para designer...",
    categoria: "TECNOLOGIA",
    status: "ATIVA",
    tipoContrato: "CLT",
    nivelExperiencia: "PLENO",
    areaCandidato: "OUTRO",
    clienteId: "cliente-id",

    // Apenas conectar localização existente
    localizacao: { id: "localizacao-existente" },

    // Apenas conectar benefícios existentes
    beneficios: [{ id: "beneficio-1" }, { id: "beneficio-2" }],
  };

  const relations: Record<string, RelationConfig> = {
    localizacao: {
      type: "one-to-one",
      connectOnly: true, // Apenas conectar, não criar
    },
    beneficios: {
      type: "one-to-many",
      connectOnly: true, // Apenas conectar, não criar
    },
  };

  return await save({
    prisma,
    tx,
    model: "vaga",
    data: vagaData,
    relations,
  });
}

// Exemplo 3: Vaga médica com habilidades específicas
export async function exemploVagaMedica(prisma: any, tx: any) {
  const vagaData = {
    titulo: "Médico Cardiologista",
    descricao: "Procuramos médico cardiologista experiente...",
    categoria: "SAUDE",
    status: "ATIVA",
    tipoContrato: "CLT",
    nivelExperiencia: "ESPECIALISTA",
    areaCandidato: "MEDICINA",
    clienteId: "cliente-id",

    localizacao: {
      cidade: "Rio de Janeiro",
      uf: "RJ",
      cep: "20000-000",
      bairro: "Centro",
      estado: "Rio de Janeiro",
      regiao: "Sudeste",
    },

    beneficios: [
      {
        nome: "Plano de Saúde",
        descricao: "Cobertura completa",
      },
      {
        nome: "Vale Alimentação",
        descricao: "R$ 30,00 por dia",
      },
    ],

    habilidades: [
      {
        nome: "Cardiologia",
        tipoHabilidade: "ESPECIALIDADE",
        nivelExigido: "ESPECIALISTA",
      },
      {
        nome: "Eletrocardiograma",
        tipoHabilidade: "EXAME",
        nivelExigido: "AVANCADO",
      },
    ],
  };

  const relations: Record<string, RelationConfig> = {
    localizacao: {
      type: "one-to-one",
      validation: {
        uniqueKeys: ["cidade", "uf"],
      },
    },
    beneficios: {
      type: "one-to-many",
      validation: {
        uniqueKeys: ["nome"],
      },
    },
    habilidades: {
      type: "many-to-many",
      validation: {
        uniqueKeys: ["nome"],
      },
    },
  };

  return await save({
    prisma,
    tx,
    model: "vaga",
    data: vagaData,
    relations,
  });
}

// Exemplo 4: Update de vaga existente
export async function exemploUpdateVaga(prisma: any, tx: any) {
  const vagaData = {
    id: "vaga-existente-id", // ID da vaga para update
    titulo: "Desenvolvedor Fullstack Sênior - Atualizado",
    descricao: "Descrição atualizada...",
    categoria: "TECNOLOGIA",
    status: "ATIVA",
    tipoContrato: "CLT",
    nivelExperiencia: "SENIOR",
    areaCandidato: "OUTRO",
    clienteId: "cliente-id",

    // Atualiza localização
    localizacao: {
      cidade: "São Paulo",
      uf: "SP",
      cep: "01310-100",
      bairro: "Bela Vista",
      estado: "São Paulo",
      regiao: "Sudeste",
    },

    // Adiciona novos benefícios
    beneficios: [
      {
        nome: "Vale Transporte",
        descricao: "R$ 200,00 por mês",
      },
    ],
  };

  const relations: Record<string, RelationConfig> = {
    localizacao: {
      type: "one-to-one",
      validation: {
        uniqueKeys: ["cidade", "uf"],
      },
    },
    beneficios: {
      type: "one-to-many",
      validation: {
        uniqueKeys: ["nome"],
      },
    },
  };

  return await save({
    prisma,
    tx,
    model: "vaga",
    idField: "id",
    data: vagaData,
    relations,
  });
}
