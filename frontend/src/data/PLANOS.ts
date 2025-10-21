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
];
