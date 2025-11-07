// =====================================================
// PLANOS PLATAFORMA

import { CategoriaPlano, TipoPlano } from "../../src/types/billings";

const NomePlano = {
  PLANO_ESSENCIAL_PLATAFORMA: "PLANO ESSENCIAL",
  PLANO_PROFISSINAL_PLATAFORMA: "PLANO PROFISSINAL",
  PLANO_CORPORATIVO_PLATAFORMA: "PLANO CORPORATIVO",

  BASICO_CONTATOS_COM_RQE: "BASICO CONTATOS",
  VIP_COM_RQE: "VIP",
  MASTER_COM_RQE: "MASTER",

  BASICO_CONTATOS_SEM_RQE: "BASICO CONTATOS",
  VIP_SEM_RQE: "VIP",
  MASTER_SEM_RQE: "MASTER",

  PLANO_ESSENCIAL_DIVERSOS: "PLANO ESSENCIAL",
  PLANO_PROFISSINAL_DIVERSOS: "PLANO PROFISSINAL",
  PLANO_PREMIUM_DIVERSOS: "PLANO PREMIUM",
};

// =====================================================
// PLATAFORMA
// =====================================================
export const plataformaSeed = [
  // PLANO ESSENCIAL PLATAFORMA
  {
    nome: NomePlano.PLANO_ESSENCIAL_PLATAFORMA,
    descricao:
      "Acesso ilimitado à base de médicos. Filtros avançados de busca. Contato direto via plataforma. Suporte básico.",
    preco: 989,
    diasGarantia: null,
    ativo: true,
    limiteUso: 5, // acesso ilimitado
    destaque: false,
    tipo: TipoPlano.MENSAL,
    categoria: CategoriaPlano.PLATAFORMA,
  },
  // PLANO PROFISSINAL PLATAFORMA
  {
    nome: NomePlano.PLANO_PROFISSINAL_PLATAFORMA,
    descricao:
      "Todas as funcionalidades do Essencial. Consultor dedicado. Dashboard personalizado. Relatórios mensais. Suporte prioritário.",
    preco: 1890,
    diasGarantia: null,
    ativo: true,
    limiteUso: 10,
    destaque: true,
    tipo: TipoPlano.MENSAL,
    categoria: CategoriaPlano.PLATAFORMA,
  },
  // PLANO CORPORATIVO PLATAFORMA
  {
    nome: NomePlano.PLANO_CORPORATIVO_PLATAFORMA,
    descricao:
      "Todas as funcionalidades do Profissional. Integração com sistemas internos. Treinamento in company. Implantação personalizada. Condições exclusivas para grandes volumes.",
    preco: 0, // Sob consulta
    diasGarantia: null,
    ativo: true,
    limiteUso: 20,
    destaque: false,
    tipo: TipoPlano.MENSAL,
    categoria: CategoriaPlano.PLATAFORMA,
  },
];

// =====================================================
// RECRUTAMENTO COM RQE
// =====================================================
export const recrutamentoComRQESeed = [
  // BÁSICO CONTATOS COM RQE
  {
    nome: NomePlano.BASICO_CONTATOS_COM_RQE,
    descricao: "Captação inicial com contatos interessados. Sem garantia.",
    preco: 1000,
    diasGarantia: null,
    ativo: true,
    limiteUso: 5, // até 5 contatos
    destaque: false,
    tipo: TipoPlano.POR_VAGA,
    categoria: CategoriaPlano.RECRUTAMENTO_COM_RQE,
    detalhes: [
      "Captação de profissionais",
      "Levantamento de interesse",
      "Envio de até 05 contatos interessados",
    ],
    observacao: "Sem garantia",
  },
  // VIP COM RQE
  {
    nome: NomePlano.VIP_COM_RQE,
    descricao:
      "Acompanhamento e envio de profissionais até fechamento. Garantia de 60 dias.",
    preco: 1500,
    diasGarantia: 60,
    ativo: true,
    limiteUso: null,
    destaque: false,
    tipo: TipoPlano.POR_VAGA,
    categoria: CategoriaPlano.RECRUTAMENTO_COM_RQE,
    detalhes: [
      "Captação de profissionais",
      "Negociação de repasse",
      "Negociação de agendas",
      "Agendamento de reuniões",
      "Profissionais serão enviados até o fechamento",
    ],
    observacao: "Garantia de 60 dias",
  },
  // MASTER COM RQE
  {
    nome: NomePlano.MASTER_COM_RQE,
    descricao: "Acompanhamento premium até fechamento. Garantia de 90 dias.",
    preco: 1900,
    diasGarantia: 90,
    ativo: true,
    limiteUso: null,
    destaque: false,
    tipo: TipoPlano.POR_VAGA,
    categoria: CategoriaPlano.RECRUTAMENTO_COM_RQE,
    detalhes: [
      "Captação de profissionais",
      "Negociação de repasse",
      "Negociação de agendas",
      "Agendamento de reuniões",
      "Profissionais serão enviados até o fechamento",
    ],
    observacao: "Garantia de 90 dias",
  },
];

// =====================================================
// RECRUTAMENTO SEM RQE
// =====================================================
export const recrutamentoSemRQESeed = [
  // BÁSICO CONTATOS SEM RQE
  {
    nome: NomePlano.BASICO_CONTATOS_SEM_RQE,
    descricao: "Captação inicial com contatos interessados. Sem garantia.",
    preco: 680,
    diasGarantia: null,
    ativo: true,
    limiteUso: 5, // até 5 contatos
    destaque: false,
    tipo: TipoPlano.POR_VAGA,
    categoria: CategoriaPlano.RECRUTAMENTO_SEM_RQE,
    detalhes: [
      "Captação de profissionais",
      "Levantamento de interesse",
      "Envio de até 05 contatos interessados",
    ],
    observacao: "Sem garantia",
  },
  // VIP SEM RQE
  {
    nome: NomePlano.VIP_SEM_RQE,
    descricao:
      "Acompanhamento e envio de profissionais até fechamento. Garantia de 60 dias.",
    preco: 1100,
    diasGarantia: 60,
    ativo: true,
    limiteUso: null,
    destaque: false,
    tipo: TipoPlano.POR_VAGA,
    categoria: CategoriaPlano.RECRUTAMENTO_SEM_RQE,
    detalhes: [
      "Captação de profissionais",
      "Negociação de repasse",
      "Negociação de agendas",
      "Agendamento de reuniões",
      "Profissionais serão enviados até o fechamento",
    ],
    observacao: "Garantia de 60 dias",
  },
  // MASTER SEM RQE
  {
    nome: NomePlano.MASTER_SEM_RQE,
    descricao: "Acompanhamento premium até fechamento. Garantia de 90 dias.",
    preco: 1600,
    diasGarantia: 90,
    ativo: true,
    limiteUso: null,
    destaque: false,
    tipo: TipoPlano.POR_VAGA,
    categoria: CategoriaPlano.RECRUTAMENTO_SEM_RQE,
    detalhes: [
      "Captação de profissionais",
      "Negociação de repasse",
      "Negociação de agendas",
      "Agendamento de reuniões",
      "Profissionais serão enviados até o fechamento",
    ],
    observacao: "Garantia de 90 dias",
  },
];

// =====================================================
// RECRUTAMENTO DIVERSOS
// =====================================================
export const recrutamentoDiversosSeed = [
  // PLANO ESSENCIAL DIVERSOS
  {
    nome: NomePlano.PLANO_ESSENCIAL_DIVERSOS,
    descricao:
      "Ideal para primeiras contratações. Publicação de vaga. Triagem inicial de currículos. Entrevistas com 3 candidatos finalistas. Suporte via e-mail.",
    preco: 0, // 60% do salário - calculado dinamicamente
    diasGarantia: 30,
    ativo: true,
    limiteUso: 3, // 3 candidatos finalistas
    destaque: false,
    tipo: TipoPlano.PERCENTUAL, // 60% do salário
    categoria: CategoriaPlano.RECRUTAMENTO_DIVERSOS,
    detalhes: [
      "Publicação de vaga",
      "Triagem inicial de currículos",
      "Entrevistas com 3 candidatos finalistas",
      "Suporte via e-mail",
    ],
    observacao: "60% do salário da vaga",
  },
  // PLANO PROFISSIONAL DIVERSOS
  {
    nome: NomePlano.PLANO_PROFISSINAL_DIVERSOS,
    descricao:
      "Para volume moderado de contratações. Tudo do Plano Essencial. Avaliação de perfil comportamental. Entrevistas com 5 candidatos finalistas. Headhunting estratégico. Suporte prioritário.",
    preco: 0, // 80% do salário - calculado dinamicamente
    diasGarantia: 60,
    ativo: true,
    limiteUso: 5, // 5 candidatos finalistas
    destaque: true,
    tipo: TipoPlano.PERCENTUAL, // 80% do salário
    categoria: CategoriaPlano.RECRUTAMENTO_DIVERSOS,
    detalhes: [
      "Tudo do Plano Essencial",
      "Avaliação de perfil comportamental",
      "Entrevistas com 5 candidatos finalistas",
      "Headhunting estratégico",
      "Suporte prioritário",
    ],
    observacao: "80% do salário da vaga",
  },
  // PLANO PREMIUM DIVERSOS
  {
    nome: NomePlano.PLANO_PREMIUM_DIVERSOS,
    descricao:
      "Solução completa para grandes demandas. Tudo do Plano Premium. Hunting exclusivo (hunting passivo e ativo). Mapeamento de mercado. Avaliação de testes técnicos personalizados. Consultoria de R&S dedicada.",
    preco: 0, // Personalizado
    diasGarantia: 90,
    ativo: true,
    limiteUso: null,
    destaque: false,
    tipo: TipoPlano.PERSONALIZADO,
    categoria: CategoriaPlano.RECRUTAMENTO_DIVERSOS,
    detalhes: [
      "Tudo do Plano Profissional",
      "Hunting exclusivo (hunting passivo e ativo)",
      "Mapeamento de mercado",
      "Avaliação de testes técnicos personalizados",
      "Consultoria de R&S dedicada",
    ],
    observacao: "Valor personalizado",
  },
];

// =====================================================
// EXPORTAÇÃO UNIFICADA
// =====================================================
export const todosOsPlanos = [
  ...plataformaSeed,
  ...recrutamentoComRQESeed,
  ...recrutamentoSemRQESeed,
  ...recrutamentoDiversosSeed,
];
