export type Plan = {
  name: string;
  subtitle: string;
  price: string;
  priceType: 'fixed' | 'custom';
  items: string[];
  buttonVariant: 'accent' | 'primary';
  btnName: string;
  planKey: string;
};

export type Group = {
  title: string;
  description?: string;
  plans: Plan[];
};

export const PLANS_DATA: Group[] = [
  {
    title: 'Recrutamento Médico',
    description:
      'A Aura possui ampla experiência em recrutamento, seleção e hunting de profissionais médicos de alto nível, conectando instituições de saúde aos melhores talentos do mercado. Nossos processos são ágeis, personalizados e focados em encontrar o perfil ideal para a sua necessidade, seja para vagas fixas ou temporárias, em todo o território nacional.',
    plans: [],
  },

  {
    title: 'COM RQE',
    plans: [
      {
        name: 'BÁSICO CONTATOS',
        planKey: 'com-rqe-basico',
        subtitle: 'Captação inicial com contatos interessados. Sem garantia.',
        price: 'R$1.000',
        priceType: 'fixed',
        buttonVariant: 'accent',
        btnName: 'Solicitar Contato',
        items: [
          'Captação De Profissionais',
          'Levantamento De Interesse',
          'Envio De Até 05 Contatos Interessados',
          'Sem Garantia',
        ],
      },
      {
        name: 'VIP 1 VAGA',
        planKey: 'com-rqe-vip',
        subtitle:
          'Acompanhamento e envio de profissionais até fechamento. Garantia de 60 dias.',
        price: 'R$1.500',
        priceType: 'fixed',
        buttonVariant: 'primary',
        btnName: 'Solicitar Contato',
        items: [
          'Captação De Profissionais',
          'Negociação De Repasse',
          'Negociação De Agendas',
          'Agendamento De Reuniões',
          'Profissionais Serão Enviados Até O Fechamento',
          'Garantia De 60 Dias',
        ],
      },
      {
        name: 'MASTER 1 VAGA',
        planKey: 'com-rqe-master',
        subtitle: 'Acompanhamento premium até fechamento. Garantia de 90 dias.',
        price: 'R$1.900',
        priceType: 'fixed',
        buttonVariant: 'accent',
        btnName: 'Solicitar Contato',
        items: [
          'Captação De Profissionais',
          'Negociação De Repasse',
          'Negociação De Agendas',
          'Agendamento De Reuniões',
          'Profissionais Serão Enviados Até O Fechamento',
          'Garantia De 90 Dias',
        ],
      },
    ],
  },
  {
    title: 'SEM RQE',
    plans: [
      {
        name: 'BÁSICO CONTATOS',
        planKey: 'sem-rqe-basico',
        subtitle: 'Captação inicial com contatos interessados. Sem garantia.',
        price: 'R$680',
        priceType: 'fixed',
        buttonVariant: 'accent',
        btnName: 'Solicitar Contato',
        items: [
          'Captação De Profissionais',
          'Levantamento De Interesse',
          'Envio De Até 05 Contatos Interessados',
          'Sem Garantia',
        ],
      },
      {
        name: 'VIP 1 VAGA',
        planKey: 'sem-rqe-vip',
        subtitle:
          'Acompanhamento e envio de profissionais até fechamento. Garantia de 60 dias.',
        price: 'R$1.100',
        priceType: 'fixed',
        buttonVariant: 'primary',
        btnName: 'Solicitar Contato',
        items: [
          'Captação De Profissionais',
          'Negociação De Repasse',
          'Negociação De Agendas',
          'Agendamento De Reuniões',
          'Profissionais Serão Enviados Até O Fechamento',
          'Garantia De 60 Dias',
        ],
      },
      {
        name: 'MASTER 1 VAGA',
        planKey: 'sem-rqe-master',
        subtitle: 'Acompanhamento premium até fechamento. Garantia de 90 dias.',
        price: 'R$1.600',
        priceType: 'fixed',
        buttonVariant: 'accent',
        btnName: 'Solicitar Contato',
        items: [
          'Captação De Profissionais',
          'Negociação De Repasse',
          'Negociação De Agendas',
          'Agendamento De Reuniões',
          'Profissionais Serão Enviados Até O Fechamento',
          'Garantia De 90 Dias',
        ],
      },
    ],
  },
  {
    title: 'Recrutamento & Seleção Tradicional',
    description:
      'Planos tradicionais de recrutamento e seleção para vagas técnicas, administrativas e estratégicas, adaptados de acordo com o volume e o perfil das contratações desejadas pela sua empresa.',
    plans: [
      {
        name: 'Plano Essencial',
        planKey: 'essencial',
        subtitle: 'Ideal para primeiras contratações',
        price: '60%/Salário',
        priceType: 'fixed',
        buttonVariant: 'accent',
        btnName: 'Solicitar Contato',
        items: [
          'Publicação de vaga',
          'Triagem inicial de currículos',
          'Entrevistas com 3 candidatos finalistas',
          'Suporte via e-mail',
          'Garantia de 30 dias',
        ],
      },
      {
        name: 'Plano Profissional',
        planKey: 'profissional',
        subtitle: 'Para volume moderado de contratações',
        price: '80%/Salário',
        priceType: 'fixed',
        buttonVariant: 'primary',
        btnName: 'Solicitar Contato',
        items: [
          'Tudo do Plano Essencial',
          'Avaliação de perfil comportamental',
          'Entrevistas com 5 candidatos finalistas',
          'Headhunting estratégico',
          'Suporte prioritário',
          'Garantia de 60 dias',
        ],
      },
      {
        name: 'Plano Premium',
        planKey: 'premium',
        subtitle: 'Solução completa para grandes demandas',
        price: 'Personalizado',
        priceType: 'custom',
        buttonVariant: 'accent',
        btnName: 'Solicitar Contato',
        items: [
          'Tudo do Plano Profissional',
          'Hunting exclusivo (hunting passivo e ativo)',
          'Mapeamento de mercado',
          'Avaliação de testes técnicos personalizados',
          'Consultoria de R&S dedicada',
          'Garantia de 90 dias',
        ],
      },
    ],
  },
];
