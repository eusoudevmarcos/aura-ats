// =====================================================
// PLANOS PLATAFORMA
// =====================================================
export const plataformaSeed = [
  {
    nome: "Plano Essencial",
    descricao:
      "Acesso ilimitado à base de médicos. Filtros avançados de busca. Contato direto via plataforma. Suporte básico.",
    preco: 989.0,
    diasGarantia: null,
    ativo: true,
    limiteUso: null, // acesso ilimitado
    destaque: false,
    tipo: "MENSAL",
    categoria: "PLATAFORMA",
  },
  {
    nome: "Plano Profissional",
    descricao:
      "Todas as funcionalidades do Essencial. Consultor dedicado. Dashboard personalizado. Relatórios mensais. Suporte prioritário.",
    preco: 1890.0,
    diasGarantia: null,
    ativo: true,
    limiteUso: null,
    destaque: true,
    tipo: "MENSAL",
    categoria: "PLATAFORMA",
  },
  {
    nome: "Plano Corporativo",
    descricao:
      "Todas as funcionalidades do Profissional. Integração com sistemas internos. Treinamento in company. Implantação personalizada. Condições exclusivas para grandes volumes.",
    preco: 0.0, // Sob consulta
    diasGarantia: null,
    ativo: true,
    limiteUso: null,
    destaque: false,
    tipo: "MENSAL",
    categoria: "PLATAFORMA",
  },
];

// =====================================================
// RECRUTAMENTO COM RQE
// =====================================================
export const recrutamentoComRQESeed = [
  {
    nome: "BÁSICO CONTATOS",
    descricao: "Captação inicial com contatos interessados. Sem garantia.",
    preco: 1000.0,
    diasGarantia: null,
    ativo: true,
    limiteUso: 5, // até 5 contatos
    destaque: false,
    tipo: "POR_VAGA",
    categoria: "RECRUTAMENTO_COM_RQE",
    detalhes: [
      "Captação de profissionais",
      "Levantamento de interesse",
      "Envio de até 05 contatos interessados",
    ],
    observacao: "Sem garantia",
  },
  {
    nome: "VIP 1 VAGA",
    descricao:
      "Acompanhamento e envio de profissionais até fechamento. Garantia de 60 dias.",
    preco: 1500.0,
    diasGarantia: 60,
    ativo: true,
    limiteUso: null,
    destaque: false,
    tipo: "POR_VAGA",
    categoria: "RECRUTAMENTO_COM_RQE",
    detalhes: [
      "Captação de profissionais",
      "Negociação de repasse",
      "Negociação de agendas",
      "Agendamento de reuniões",
      "Profissionais serão enviados até o fechamento",
    ],
    observacao: "Garantia de 60 dias",
  },
  {
    nome: "MASTER 1 VAGA",
    descricao: "Acompanhamento premium até fechamento. Garantia de 90 dias.",
    preco: 1900.0,
    diasGarantia: 90,
    ativo: true,
    limiteUso: null,
    destaque: false,
    tipo: "POR_VAGA",
    categoria: "RECRUTAMENTO_COM_RQE",
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
  {
    nome: "BÁSICO CONTATOS",
    descricao: "Captação inicial com contatos interessados. Sem garantia.",
    preco: 680.0,
    diasGarantia: null,
    ativo: true,
    limiteUso: 5, // até 5 contatos
    destaque: false,
    tipo: "POR_VAGA",
    categoria: "RECRUTAMENTO_SEM_RQE",
    detalhes: [
      "Captação de profissionais",
      "Levantamento de interesse",
      "Envio de até 05 contatos interessados",
    ],
    observacao: "Sem garantia",
  },
  {
    nome: "VIP 1 VAGA",
    descricao:
      "Acompanhamento e envio de profissionais até fechamento. Garantia de 60 dias.",
    preco: 1100.0,
    diasGarantia: 60,
    ativo: true,
    limiteUso: null,
    destaque: false,
    tipo: "POR_VAGA",
    categoria: "RECRUTAMENTO_SEM_RQE",
    detalhes: [
      "Captação de profissionais",
      "Negociação de repasse",
      "Negociação de agendas",
      "Agendamento de reuniões",
      "Profissionais serão enviados até o fechamento",
    ],
    observacao: "Garantia de 60 dias",
  },
  {
    nome: "MASTER 1 VAGA",
    descricao: "Acompanhamento premium até fechamento. Garantia de 90 dias.",
    preco: 1600.0,
    diasGarantia: 90,
    ativo: true,
    limiteUso: null,
    destaque: false,
    tipo: "POR_VAGA",
    categoria: "RECRUTAMENTO_SEM_RQE",
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
  {
    nome: "Plano Essencial",
    descricao:
      "Ideal para primeiras contratações. Publicação de vaga. Triagem inicial de currículos. Entrevistas com 3 candidatos finalistas. Suporte via e-mail.",
    preco: 0.0, // 60% do salário - calculado dinamicamente
    diasGarantia: 30,
    ativo: true,
    limiteUso: 3, // 3 candidatos finalistas
    destaque: false,
    tipo: "PERCENTUAL", // 60% do salário
    categoria: "RECRUTAMENTO_DIVERSOS",
    detalhes: [
      "Publicação de vaga",
      "Triagem inicial de currículos",
      "Entrevistas com 3 candidatos finalistas",
      "Suporte via e-mail",
    ],
    observacao: "60% do salário da vaga",
  },
  {
    nome: "Plano Profissional",
    descricao:
      "Para volume moderado de contratações. Tudo do Plano Essencial. Avaliação de perfil comportamental. Entrevistas com 5 candidatos finalistas. Headhunting estratégico. Suporte prioritário.",
    preco: 0.0, // 80% do salário - calculado dinamicamente
    diasGarantia: 60,
    ativo: true,
    limiteUso: 5, // 5 candidatos finalistas
    destaque: true,
    tipo: "PERCENTUAL", // 80% do salário
    categoria: "RECRUTAMENTO_DIVERSOS",
    detalhes: [
      "Tudo do Plano Essencial",
      "Avaliação de perfil comportamental",
      "Entrevistas com 5 candidatos finalistas",
      "Headhunting estratégico",
      "Suporte prioritário",
    ],
    observacao: "80% do salário da vaga",
  },
  {
    nome: "Plano Premium",
    descricao:
      "Solução completa para grandes demandas. Tudo do Plano Profissional. Hunting exclusivo (hunting passivo e ativo). Mapeamento de mercado. Avaliação de testes técnicos personalizados. Consultoria de R&S dedicada.",
    preco: 0.0, // Personalizado
    diasGarantia: 90,
    ativo: true,
    limiteUso: null,
    destaque: false,
    tipo: "PERSONALIZADO",
    categoria: "RECRUTAMENTO_DIVERSOS",
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
