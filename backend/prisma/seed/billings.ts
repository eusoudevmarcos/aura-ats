export const billingPlataformSeed = [
  {
    nome: "Plano Essencial",
    descricao:
      "Acesso completo à base de médicos. Filtros de especialidade e localização. Suporte básico.",
    preco: 989.0,
    diasGarantia: null,
    ativo: true,
    limitePesquisas: 40,
    destaque: false,
    tipo: "POR_USO",
  },
  {
    nome: "Plano Profissional",
    descricao:
      "Tudo do Essencial. Suporte prioritário. Relatórios e exportação.",
    preco: 1949.0,
    diasGarantia: null,
    ativo: true,
    limitePesquisas: 100,
    destaque: true,
    tipo: "POR_USO",
  },
  {
    nome: "Plano Premium",
    descricao: "Tudo do Plano Profissional. Até 150 pesquisas/mês.",
    preco: 2499.0,
    diasGarantia: null,
    ativo: true,
    limitePesquisas: 150,
    destaque: false,
    tipo: "POR_USO",
  },
];

export const billingRecrutamentoSemRQESeed = [
  {
    nome: "BÁSICO CONTATOS",
    descricao:
      "Captação de profissionais. Levantamento de interesse. Envio de até 8 contatos interessados.",
    preco: 680.0,
    diasGarantia: null,
    ativo: true,
    destaque: false,
    tipo: "MENSAL",
    detalhes: [
      "Captação de profissionais",
      "Levantamento de interesse",
      "Envio de até 8 contatos interessados",
    ],
    observacao: "Sem garantia",
  },
  {
    nome: "VIP 1 VAGA",
    descricao:
      "Captação de profissionais. Negociação de repasse. Negociação de agendas. Agendamento de reuniões. Profissionais serão enviados até o fechamento.",
    preco: 1100.0,
    diasGarantia: null,
    ativo: true,
    destaque: false,
    tipo: "MENSAL",
    detalhes: [
      "Captação de profissionais",
      "Negociação de repasse",
      "Negociação de agendas",
      "Agendamento de reuniões",
      "Profissionais serão enviados até o fechamento",
    ],
    observacao: "Garantia de 30 dias",
  },
  {
    nome: "MASTER 1 VAGA",
    descricao:
      "Captação de profissionais. Negociação de repasse. Negociação de agendas. Agendamento de reuniões. Profissionais serão enviados até o fechamento.",
    preco: 1600.0,
    diasGarantia: null,
    ativo: true,
    destaque: false,
    tipo: "MENSAL",
    detalhes: [
      "Captação de profissionais",
      "Negociação de repasse",
      "Negociação de agendas",
      "Agendamento de reuniões",
      "Profissionais serão enviados até o fechamento",
    ],
    observacao: "Garantia de 60 dias",
  },
];

export const planosComRQE = [
  {
    nome: "BÁSICO CONTATOS",
    descricao:
      "Captação de profissionais. Levantamento de interesse. Envio de até 8 contatos interessados.",
    preco: 1000.0,
    diasGarantia: null,
    ativo: true,
    destaque: false,
    tipo: "MENSAL",
    detalhes: [
      "Captação de profissionais",
      "Levantamento de interesse",
      "Envio de até 8 contatos interessados",
    ],
    observacao: "Sem garantia",
  },
  {
    nome: "VIP 1 VAGA",
    descricao:
      "Captação de profissionais. Negociação de repasse. Negociação de agendas. Agendamento de reuniões. Profissionais serão enviados até o fechamento.",
    preco: 1500.0,
    diasGarantia: 30,
    ativo: true,
    destaque: false,
    tipo: "MENSAL",
    detalhes: [
      "Captação de profissionais",
      "Negociação de repasse",
      "Negociação de agendas",
      "Agendamento de reuniões",
      "Profissionais serão enviados até o fechamento",
    ],
    observacao: "Garantia de 30 dias",
  },
  {
    nome: "MASTER 1 VAGA",
    descricao:
      "Captação de profissionais. Negociação de repasse. Negociação de agendas. Agendamento de reuniões. Profissionais serão enviados até o fechamento.",
    preco: 1900.0,
    diasGarantia: 60,
    ativo: true,
    destaque: false,
    tipo: "MENSAL",
    detalhes: [
      "Captação de profissionais",
      "Negociação de repasse",
      "Negociação de agendas",
      "Agendamento de reuniões",
      "Profissionais serão enviados até o fechamento",
    ],
    observacao: "Garantia de 60 dias",
  },
];
