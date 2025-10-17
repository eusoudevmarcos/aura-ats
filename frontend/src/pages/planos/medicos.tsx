import logoImg from '@/assets/logo.svg';
import Image from 'next/image';
import Link from 'next/link';

type Plano = {
  title: string;
  price: string;
  features: string[];
  guarantee: string;
};

// Planos para profissionais SEM RQE [cite: 4]
const planosSemRQE = [
  {
    title: 'BÁSICO CONTATOS', // [cite: 5, 8]
    price: 'R$680', // [cite: 11]
    features: [
      'CAPTAÇÃO DE PROFISSIONAIS', // [cite: 16]
      'LEVANTAMENTO DE INTERESSE', // [cite: 18]
      'ENVIO DE ATÉ 05 CONTATOS INTERESSADOS', // [cite: 29, 30]
    ],
    guarantee: 'Sem Garantia', // [cite: 35]
  },
  {
    title: 'VIP 1 VAGA', // [cite: 6, 10]
    price: 'R$1.100', // [cite: 12]
    features: [
      'CAPTAÇÃO DE PROFISSIONAIS', // [cite: 15]
      'NEGOCIAÇÃO DE REPASSE', // [cite: 17]
      'NEGOCIAÇÃO DE AGENDAS', // [cite: 26, 28]
      'AGENDAMENTO DE REUNIÕES', // [cite: 32]
      'PROFISSIONAIS SERÃO ENVIADOS ATÉ O FECHAMENTO', // [cite: 32, 34]
    ],
    guarantee: 'Garantia de 60 dias', // [cite: 36]
  },
  {
    title: 'MASTER 1 VAGA', // [cite: 7, 9]
    price: 'R$1.600', // [cite: 13]
    features: [
      'CAPTAÇÃO DE PROFISSIONAIS', // [cite: 23]
      'NEGOCIAÇÃO DE REPASSE', // [cite: 24]
      'NEGOCIAÇÃO DE AGENDAS', // [cite: 25, 27]
      'AGENDAMENTO DE REUNIÕES', // [cite: 31]
      'PROFISSIONAIS SERÃO ENVIADOS ATÉ O FECHAMENTO', // [cite: 31, 33]
    ],
    guarantee: 'Garantia de 90 dias', // [cite: 37]
  },
];

// Planos para profissionais COM RQE [cite: 48, 93]
const planosComRQE = [
  {
    title: 'BÁSICO CONTATOS', // [cite: 49, 52, 94, 97]
    price: 'R$1.000', // [cite: 55, 100]
    features: [
      'CAPTAÇÃO DE PROFISSIONAIS', // [cite: 58, 59, 103, 104]
      'LEVANTAMENTO DE INTERESSE', // [cite: 60, 105]
      'ENVIO DE ATÉ 05 CONTATOS INTERESSADOS', // [cite: 61, 75, 106, 120]
    ],
    guarantee: 'Sem Garantia', // [cite: 80, 125]
  },
  {
    title: 'VIP 1 VAGA', // [cite: 50, 54, 95, 99]
    price: 'R$1.500', // [cite: 56, 101]
    features: [
      'CAPTAÇÃO DE PROFISSIONAIS', // [cite: 66, 111]
      'NEGOCIAÇÃO DE REPASSE', // [cite: 69, 114]
      'NEGOCIAÇÃO DE AGENDAS', // [cite: 72, 74, 117, 119]
      'AGENDAMENTO DE REUNIÕES', // [cite: 77, 122]
      'PROFISSIONAIS SERÃO ENVIADOS ATÉ O FECHAMENTO', // [cite: 77, 79, 122, 124]
    ],
    guarantee: 'Garantia de 60 dias', // [cite: 81, 126]
  },
  {
    title: 'MASTER 1 VAGA', // [cite: 51, 53, 96, 98]
    price: 'R$1.900', // [cite: 57, 102]
    features: [
      'CAPTAÇÃO DE PROFISSIONAIS', // [cite: 67, 112]
      'NEGOCIAÇÃO DE REPASSE', // [cite: 70, 115]
      'NEGOCIAÇÃO DE AGENDAS', // [cite: 71, 73, 116, 118]
      'AGENDAMENTO DE REUNIÕES', // [cite: 76, 121]
      'PROFISSIONAIS SERÃO ENVIADOS ATÉ O FECHAMENTO', // [cite: 76, 78, 121, 123]
    ],
    guarantee: 'Garantia de 90 dias', // [cite: 82, 127]
  },
];

const checkIcon = (
  <span
    className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-violet-600 font-bold mr-2 border border-violet-200"
    style={{ minWidth: 24, minHeight: 24 }}
  >
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path
        d="M7.62939 14.464L3 9.83465L4.41421 8.42044L7.62939 11.6356L15.5858 3.6792L17 5.09341L7.62939 14.464Z"
        fill="#7C3AED"
      />
    </svg>
  </span>
);

const PlanosHeader = () => (
  <header className="w-full bg-white shadow-md fixed top-0 left-0 z-30">
    <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src={logoImg}
          alt="Aura ATS Logo"
          width={36}
          height={36}
          className="h-9 w-9"
        />
        <span className="text-lg font-bold text-violet-700">
          A<span className="text-black">u</span>ra
        </span>
      </Link>
      <Link
        href="/login"
        className="bg-violet-600 text-white px-5 py-2 rounded-full font-medium shadow hover:bg-violet-700 transition text-sm"
      >
        Entrar
      </Link>
    </div>
  </header>
);

const PlanCard = ({ plano, idx }: { plano: Plano; idx: number }) => (
  <div
    className={`flex flex-col flex-1 bg-gradient-to-tr from-violet-600 to-violet-400 text-white rounded-2xl shadow-lg px-6 pb-8 pt-6 relative transition-transform hover:scale-105`}
  >
    {/* canto superior direito visual */}
    <div className="absolute top-0 right-0 w-24 h-20 overflow-hidden rounded-tr-2xl">
      <svg
        height="100"
        width="100"
        viewBox="0 0 100 100"
        className="absolute right-0 top-0 opacity-20"
      >
        <circle
          cx="80"
          cy="20"
          r="40"
          fill="none"
          stroke="#fff"
          strokeWidth="8"
        />
        <circle
          cx="80"
          cy="20"
          r="30"
          fill="none"
          stroke="#fff"
          strokeWidth="3"
        />
        <circle
          cx="80"
          cy="20"
          r="20"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
        />
      </svg>
    </div>

    <h1>Recrutamento Médico</h1>

    <h2 className="text-lg font-extrabold text-white mb-1 tracking-wide text-center drop-shadow">
      {plano.title}
    </h2>
    <div className="text-3xl md:text-3xl font-bold text-white mb-4 text-center drop-shadow">
      {plano.price}
    </div>
    <div className="flex flex-col gap-3 mb-6 mt-2">
      {plano.features.map((feature, i: number) => (
        <div
          key={i}
          className="flex items-center text-sm font-semibold tracking-wide"
        >
          {checkIcon}
          <span>{feature}</span>
        </div>
      ))}
    </div>
    <div className="mt-auto flex justify-center">
      <span
        className={`rounded-full px-4 py-2 font-semibold border-2 text-sm ${
          idx === 0
            ? 'border-white bg-white text-violet-600'
            : idx === 1
            ? 'border-yellow-300 bg-yellow-400 text-violet-700'
            : 'border-gray-200 bg-gray-100 text-violet-700'
        }`}
      >
        {plano.guarantee}
      </span>
    </div>
  </div>
);

const PlanosMedicoPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-24 pb-12 px-4">
    <PlanosHeader />

    {/* SEÇÃO SEM RQE */}
    <div className="w-full max-w-5xl mb-16">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Profissionais Sem RQE
      </h2>
      <div className="flex flex-col md:flex-row gap-6 w-full">
        {planosSemRQE.map((plano: Plano, idx) => (
          <PlanCard key={`sem-rqe-${plano.title}`} plano={plano} idx={idx} />
        ))}
      </div>
    </div>

    {/* SEÇÃO COM RQE */}
    <div className="w-full max-w-5xl">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Profissionais Com RQE
      </h2>
      <div className="flex flex-col md:flex-row gap-6 w-full">
        {planosComRQE.map((plano, idx) => (
          <PlanCard key={`com-rqe-${plano.title}`} plano={plano} idx={idx} />
        ))}
      </div>
    </div>

    <div className="w-full max-w-5xl mx-auto mt-16 text-center">
      <h3 className="text-lg font-bold text-violet-700 mb-4">
        Tem interesse ou precisa de um plano personalizado?
      </h3>
      <a
        href="https://api.whatsapp.com/send?phone=5561992483665&text=Olá!%20Tenho%20interesse%20em%20anunciar%20uma%20vaga%20ou%20sobre%20os%20planos."
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-violet-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:bg-violet-700 transition"
      >
        Fale com a gente no WhatsApp
      </a>
    </div>
  </div>
);

export default PlanosMedicoPage;
